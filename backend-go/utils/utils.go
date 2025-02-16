package utils

import (
	"errors"
	"fmt"
	"net/mail"
	"net/smtp"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/moonsungkil/bukowski/database"
	model "github.com/moonsungkil/bukowski/models"
	"golang.org/x/crypto/bcrypt"
)

func UpdateFields(field, details string, user *model.User) error {
	if details != "" {
		err := database.DB.Model(&user).Update(field, details)
		if err != nil {
			return err.Error
		}
		return nil
	}
	return nil
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password),14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func CheckIfAuthorizedAndGetUserFromReq(ctx *gin.Context) (model.User, error) {
	userReq, exists := ctx.Get("user")
	if !exists {
		return model.User{}, errors.New("not authorized")
	}

	user, ok := userReq.(model.User)
	if !ok {
		return model.User{}, errors.New("invalud user type in context")
	}

	return user, nil
}

func DeleteAssociatedGenres(taleID uint) error {
	result := database.DB.Where("tale_id = ?", taleID).Delete(&model.TaleGenre{})
	return result.Error
}

func UploadImage(ctx *gin.Context, uploadDir string) (string, error) {
	// Retrive the file from the request
	file, err := ctx.FormFile("file")
	if err != nil {
		return "", err
	}

	// Ensure the directory exists
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	//Generating a unique name for the file
	ext := filepath.Ext(file.Filename)
	newFileName :=  uuid.New().String() + "-" + time.Now().Format("20060102150405") + ext

	// Save the file to the server
	filePath := filepath.Join(uploadDir, newFileName)
	if err := ctx.SaveUploadedFile(file, filePath); err !=nil {
		return "", err
	}

	relativePath := uploadDir[2:] + "/" + newFileName
	return relativePath, nil
}

func MoveImageToAnotherDirectory(ctx *gin.Context, imageLocation, destDir string ) (string,error) {

	// Ensure that the new directory exists
	if _ , err := os.Stat(destDir); os.IsNotExist(err) {
		 err := os.MkdirAll(destDir, os.ModePerm)
		 if err != nil {
			return "", err
		 }
	}

	imageLocation = filepath.Clean(imageLocation)
	destDir = filepath.Clean(destDir)
	fileName := filepath.Base(imageLocation)
	newLocation := filepath.Join(destDir, fileName)
	

	oldPath := filepath.ToSlash(imageLocation)
	oldPath = filepath.Join("..", oldPath)
	newPath := filepath.ToSlash(newLocation)

	if err := os.Rename(oldPath, newPath); err != nil {
		return "", err
	}

	relativePath := newPath[2:]
	return relativePath, nil
}

func UpdateTaleRating(ctx *gin.Context, taleId, userId uint, submittedRating int) (float64, error) {
	var tale model.Tale
	result := database.DB.Where("id = ?", taleId).Unscoped().First(&tale)
	if result.Error != nil {
		return 0, errors.New("tale not found")
	}

	var purchasedTales []model.TalePurchase
	result = database.DB.Where("tale_id = ? AND purchaser_user_id != ?", taleId, userId).Find(&purchasedTales)
	if result.Error != nil {
		return 0, errors.New("internal Server Error")
	}
	var allRatings float64
	if result.RowsAffected != 0 {
		for _, t := range purchasedTales {
			allRatings += float64(t.UserRating)
		} 
	}

	var newRating float64
	if len(purchasedTales) == 0 {
		newRating = float64(submittedRating)
	} else {
		newRating = (float64(submittedRating) + allRatings) / (float64(len(purchasedTales)) + 1)
	}
	tale.Rating = float64(newRating)

	result = database.DB.Save(&tale)
	if result.Error != nil {
		return 0, errors.New("unable to update rating")
	}

	return float64(newRating), nil
}

func GenerateResetToken(email string) (string, error) {
	claims := jwt.MapClaims{
		"email": email,
		"exp": time.Now().Add(15 * time.Minute).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("REST_PASSWORD_SECRET")))
}

func ValidateResetToken(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("REST_PASSWORD_SECRET")), nil
	})

	if err != nil || !token.Valid {
		return "", errors.New("token not valid")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || claims["email"] == nil {
		return "", errors.New("token not valid")
	}

	return claims["email"].(string), nil
}

func SendRestPasswordLink(userEmail, resetLink string) (bool, error) {
	_, err := mail.ParseAddress(userEmail)
	if err != nil {
		return false, errors.New("not a valid email format")
	} 

	emailBody := fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bukowski: Reset Password</title>
</head>
<body>
    <div class="container">
        <a href="%s" class="button">Reset Password</a>
    </div>
</body>
</html>`, resetLink)

bukowskiEmail := os.Getenv("NL_EMAIL")
	bukowskiAppPass := os.Getenv("NL_APP_PASS")

	auth := smtp.PlainAuth(
		"",
		bukowskiEmail,
		bukowskiAppPass,
		"smtp.gmail.com",
	)

	msg := "MIME-Version: 1.0\r\n" +
		"Content-Type: text/html; charset=\"UTF-8\"\r\n" +
		"Subject: Bukowski: Reset Password!\r\n\r\n" +
		string(emailBody)

	err = smtp.SendMail(
		"smtp.gmail.com:587",
		auth,
		bukowskiEmail,
		[]string{userEmail},
		[]byte(msg),
	)
	if err != nil {
		return false, errors.New("bad request")
	}

	return true, nil
}