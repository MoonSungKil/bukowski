package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"net/mail"
	"net/smtp"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
	"github.com/moonsungkil/bukowski/database"
	"github.com/moonsungkil/bukowski/middleware"
	model "github.com/moonsungkil/bukowski/models"
	"github.com/moonsungkil/bukowski/types"
	"github.com/moonsungkil/bukowski/utils"
	"gorm.io/gorm"
)

func HandleCreateUser(ctx *gin.Context){
	// var newUser model.User
	var userBody types.UserType

	if err := ctx.ShouldBindJSON(&userBody); err != nil {
		
		var errorMessage []string

		for _, err := range err.(validator.ValidationErrors) {
			switch err.Tag() {
			case "required":
				errorMessage = append(errorMessage, fmt.Sprintf("%s is required", err.Field()))
			case "min":
				errorMessage = append(errorMessage, fmt.Sprintf("%s must be at least %s characters", err.Field(), err.Param()))
			case "max":
				errorMessage = append(errorMessage, fmt.Sprintf("%s cannot be more than %s characters", err.Field(), err.Param()))
			case "email":
				errorMessage = append(errorMessage, "Invalid email format.")
			}
		}
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": errorMessage,
		})
		return
	}

	if userBody.Password != userBody.ConfirmPassword {
		ctx.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Passwords do not match"})
		return
	}

	hash, err := utils.HashPassword(userBody.Password);
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Internal Server Error", "details": err.Error()})
		return
	}
	
	defaultProfilePicture := "https://res.cloudinary.com/dscuqiqmz/image/upload/v1739616434/bukowski_profile_picture_images/profile_placeholder.jpg"

	newUser := model.User{
		Username: userBody.Username,
		Email: userBody.Email,
		Password: hash,
		ProfilePicture: defaultProfilePicture,
	}

	result := database.DB.Create(&newUser) 
	if result.Error != nil {
		if strings.Contains(result.Error.Error(), "Duplicate entry") {
			if strings.Contains(result.Error.Error(), "users.username") {
				ctx.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Username already taken."})
				return
			} else if strings.Contains(result.Error.Error(), "users.email"){
				ctx.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Email already taken."})
				return
			}
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error", "details": result.Error.Error()})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256,jwt.MapClaims{
		"sub": newUser.ID,
		"email": newUser.Email,
		"username": newUser.Username,
		"iat": time.Now().Unix(),
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create token", "details": err.Error()})
		return
	}

	http.SetCookie(ctx.Writer, &http.Cookie{
		Name:     "Authorization",
		Value:    tokenString,
		Path:     "/",
		Domain:   utils.GetCookieDomain(),
		Expires:  time.Now().Add(30 * 24 * time.Hour), 
		HttpOnly: true,
		Secure:   os.Getenv("ENV") == "production",
		SameSite: utils.SameSiteType(), 
	})


	sanitizedUser := map[string]interface{}{
		"id": newUser.ID,
		"username": newUser.Username,
		"email": newUser.Email,
		"profile_picture": newUser.ProfilePicture,
		"balance": newUser.Balance,
		"created_at": newUser.CreatedAt,
		}

	ctx.JSON(200, gin.H{"message":"Succesfully user Created", "user": sanitizedUser})
}

func HandleLoginUser(ctx *gin.Context) {
	var loginBody types.LoginUserBody

	if err := ctx.ShouldBindJSON(&loginBody); err != nil {

		var errorMessage []string

		for _, err := range err.(validator.ValidationErrors) {
			switch err.Tag() {
			case "required":
				errorMessage = append(errorMessage, fmt.Sprintf("%s is required", err.Field()))
			}
		}
		ctx.JSON(http.StatusBadRequest, gin.H{"success":false, "error": errorMessage})
		return
	}

	var user model.User
	result := database.DB.First(&user,"username = ?", loginBody.Username)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid Username or Password", "details": result.Error.Error()})
		return
	}

	if result.RowsAffected == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Username or Password", "details": result.Error.Error()})
		return
	}

	if !utils.CheckPasswordHash(loginBody.Password, user.Password) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Username or Password"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256,jwt.MapClaims{
		"sub": user.ID,
		"email": user.Email,
		"username": user.Username,
		"iat": time.Now().Unix(),
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET"))) 

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create a token", "details": err.Error()})
		return
	}

	http.SetCookie(ctx.Writer, &http.Cookie{
		Name:     "Authorization",
		Value:    tokenString,
		Path:     "/",
		Domain:   utils.GetCookieDomain(),
		Expires:  time.Now().Add(30 * 24 * time.Hour), 
		HttpOnly: true,
		Secure:   os.Getenv("ENV") == "production",
		SameSite: utils.SameSiteType(), 
	})

	thisType := utils.SameSiteType()

	// Return only essential info
	sanitizedUser := map[string]interface{}{
		"id": user.ID,
		"username": user.Username,
		"email": user.Email,
		"profile_picture": user.ProfilePicture,
		"balance": user.Balance,
		"created_at": user.CreatedAt,
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Successfuly Logged in", "user": sanitizedUser, "sameSite": thisType, "ENV": os.Getenv("ENV")})
}


func HandleLogoutUser(ctx *gin.Context) {
	user, ok := ctx.Get("user"); 
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "No user found"})
		return
	}


	// set expire date to expire
	http.SetCookie(ctx.Writer, &http.Cookie{
        Name:     "Authorization",
        Value:    "",
        Path:     "/",
		Domain:   utils.GetCookieDomain(),
        Expires:  time.Now().Add(-time.Hour), 
        HttpOnly: true,
        Secure:   os.Getenv("ENV") == "production",
        SameSite: utils.SameSiteType(), 
    })

	ctx.JSON(http.StatusOK, gin.H{"message": "User successfully Logged out", "user_information": user})
}

func HandleGetAllUsers(ctx *gin.Context) {
	var users []model.User

	result := database.DB.Find(&users)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	if result.RowsAffected == 0 {
		ctx.JSON(http.StatusNoContent, gin.H{"message":"No users found"})
		return
	}
	
	ctx.JSON(http.StatusOK, users)
}

func HandleGetSingleUser(ctx *gin.Context){
	id := ctx.Param("id")
	var foundUser model.User

	result := database.DB.First(&foundUser, id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		}
		return
	}

	ctx.JSON(http.StatusOK, foundUser)
}

func HandleSoftDeleteSingleUser(ctx *gin.Context) {
	user, err := utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userID := user.ID

	result := database.DB.Delete(&model.User{}, userID)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error", "details": result.Error.Error()})
		return
	}

	if result.RowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

		// set expire date to expire
		http.SetCookie(ctx.Writer, &http.Cookie{
			Name:     "Authorization",
			Value:    "",
			Path:     "/",
			Domain:   utils.GetCookieDomain(),
			Expires:  time.Now().Add(-time.Hour), 
			HttpOnly: true,
			Secure:   os.Getenv("ENV") == "production",
			SameSite: utils.SameSiteType(), 
		})

	ctx.JSON(http.StatusOK, gin.H{"success":true, "message": "User successfuly deleted"})
}

func HandlePermanentDeleteSingleUser(ctx *gin.Context) {
	id := ctx.Param("id")

	userId, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	result := database.DB.Unscoped().Delete(&model.User{}, userId)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error", "details": result.Error.Error()})
		return
	}

	if result.RowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "User permanently deleted"})

}

func HandleUpdateUserInformation(ctx *gin.Context) {
	id := ctx.Param("id")

	userId, err := strconv.ParseInt(id,10,64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var userToUpdate model.User
	result := database.DB.First(&userToUpdate, userId)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error", "details": result.Error.Error()})
		return
	}

	if result.RowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var requestData map[string]interface{}

	if err := ctx.ShouldBindJSON(&requestData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
	}

	for key, value := range requestData{
		strValue := value.(string)
		if key != "password" {
			if key == "email" {
				_, err := mail.ParseAddress(strValue)
				if err != nil {
					ctx.JSON(http.StatusBadRequest, gin.H{"error": "Not a valid email address"})
					return
				}
			}
			if err := utils.UpdateFields(key, strValue, &userToUpdate); err != nil {
				if strings.Contains(err.Error(), "1062") { //MySQL duplicate entry error code
					if strings.Contains(err.Error(), "username") {
						ctx.JSON(http.StatusBadRequest, gin.H{"error": "Username already taken"})
						return
					}
					if strings.Contains(err.Error(), "email") {
						ctx.JSON(http.StatusBadRequest, gin.H{"error": "Email already in use"})
						return
					}
				}
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"success": true, "message": "Successfuly Updated"})
}

func HandleUpdateUserPassword(ctx *gin.Context) {
	id := ctx.Param("id")

	userId, err := strconv.ParseInt(id,10,64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var userToUpdatePassword model.User
	result := database.DB.First(&userToUpdatePassword,userId);
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error", "details": result.Error.Error()})
		return
	}

	if result.RowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var passwordUpdate types.PasswordUpdate
	if err := ctx.ShouldBindJSON(&passwordUpdate); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Bad Request", "details": err.Error()})
		return
	}

	if passwordUpdate.NewPassword != passwordUpdate.ConfirmNewPassword {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Passwords do not match"})
		return
	}

	comparePasswords := utils.CheckPasswordHash(passwordUpdate.CurrentPassword, userToUpdatePassword.Password)
	if !comparePasswords {
		ctx.JSON(http.StatusBadRequest, gin.H{"error":"Wrong Password"})
		return
	}

	hash, err := utils.HashPassword(passwordUpdate.NewPassword)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error", "details": err.Error()})
		return
	}

	if hash == userToUpdatePassword.Password {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "new password cannot be old password"})
		return
	}

	result = database.DB.Model(userToUpdatePassword).Update("password", hash)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to update password", "details": result.Error.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success":true, "message": "Password Updated"})
}

func HandleSendResetUserPasswordLink(ctx *gin.Context) {
	var email types.EmailRequest

	err := ctx.ShouldBindJSON(&email)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email format"})
		return
	}

	resetToken, err := utils.GenerateResetToken(email.Email)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	resetLink := "http://localhost:3000/reset-password?token=" + resetToken

	_, err = utils.SendRestPasswordLink(email.Email, resetLink)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Reset Link Sent to Email"})
}

func HandleResetPassword(ctx *gin.Context) {
	token := ctx.Query("token")
	if token == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Token string not present"})
		return
	}

	email, err := utils.ValidateResetToken(token)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var passwordBody types.RestPassword
	if err = ctx.ShouldBindJSON(&passwordBody); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid password format"})
		return
	}

	if len(passwordBody.NewPassword) < 8 || len(passwordBody.NewPassword) > 16 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Password needs to be between 8 and 16 characters"})
		return
	}

	if passwordBody.NewPassword != passwordBody.ConfirmNewPassword {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Password do not match"})
		return
	}

	hashedPassword, err := utils.HashPassword(passwordBody.NewPassword)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	var user model.User
	result := database.DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	if result.RowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.Password = hashedPassword
	result = database.DB.Save(&user)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Password successfully reseted"})
}


func Test(ctx *gin.Context) {
	user, ok := ctx.Get("user") 
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "error from Test"})
		return 
	}

	cookies := ctx.Request.Cookies()

	for _, cookie := range cookies {
		fmt.Printf("Name: %s, Value %s, Domain: %s, Path: %s\n", cookie.Name, cookie.Value, cookie.Domain, cookie.Path)
	}

	tokenString, err := ctx.Cookie("Authorization")
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized", "details": err.Error()})
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	token, _ := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method %v", token.Header["alg"] )
		}

		return []byte(os.Getenv("SECRET")), nil
	})

	if !token.Valid {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "error getting claims"})
		return
	}

	username := claims["username"]
	email := claims["email"]
	exp := claims["exp"]
	iat := claims["iat"]

	for key, value := range claims {
		fmt.Printf("%s: %v\n", key,value)
	}

	var testUser model.User
	database.DB.Preload("PublishedTales").First(&testUser, claims["sub"])

	ctx.JSON(http.StatusOK, gin.H{"message":"Authorized User", "user": user, "username": username, "email": email, "expire date": exp, "issued at": iat, "testUser": testUser})
}

func HandleUpdateUserProfilePicture(ctx *gin.Context) {

	id := ctx.Param("id")
	userId, err := strconv.ParseInt(id,10,64) 
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var userToChangeProfilePicture model.User
	result := database.DB.First(&userToChangeProfilePicture, userId)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error", "details": result.Error.Error()})
	}

	if result.RowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Unable to retrive image from form"})
		return
	}
	fileContent, err := file.Open()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrive image from form"})
		return
	}
	defer fileContent.Close()

	folderName := "bukowski_profile_picture_images"
	pathUrl, err := utils.UploadImageToCloudinary(folderName,fileContent)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Unable to retrive image from form"})
		return
	}

	oldProfilePicture := userToChangeProfilePicture.ProfilePicture
	oldPublicID := utils.ExtractPublicID(oldProfilePicture) 

	// Updating user's profile picture in the database (the path)
	userToChangeProfilePicture.ProfilePicture = pathUrl
	if err := database.DB.Save(&userToChangeProfilePicture).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile picture"})
		return
	}
	
	if oldPublicID != "bukowski_profile_picture_images/profile_placeholder" {
		_, err := utils.DeleteImage(oldPublicID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError,gin.H{"error": "Unable to delete old draft Image"})
				return
		}
	}
	
	ctx.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully", "filePath": pathUrl})
}

func HandleDeleteAuthorizationCookie(ctx *gin.Context) {
	middleware.DeleteCookie(ctx, "Authorization")
}

func HandleSubscribeToNewsletter(ctx *gin.Context) {
	var emailBody types.EmailRequest
	err := ctx.ShouldBind(&emailBody)
	if err != nil {
		if strings.Contains(err.Error(), "required") {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Filed cannot be empty", "details": err.Error()})	
			return
		}
		if strings.Contains(err.Error(), "validation") {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Not a valid email format", "details": err.Error()})
			return
		}
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Bad Requests", "details": err.Error()})
		return
	}

	_, err = mail.ParseAddress(emailBody.Email)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Not a valid email format", "details": err.Error()})
		return
	} 

	newSubscriber := model.NewsletterSubscriber{
		Email: strings.ToLower(emailBody.Email),
	}

	result := database.DB.Create(&newSubscriber)
	if result.Error != nil {
		if strings.Contains(result.Error.Error(), "Duplicate entry") {
			ctx.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Email already subscribed"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Internal server Error", "details": result.Error.Error()})
		return
	}

	// Get the absolute path to the template
	basePath, _ := os.Getwd() // Gets the root directory where the app is running
	templatePath := filepath.Join(basePath, "email_templates", "subscribe_template.html")

	htmlContent, err := os.ReadFile(templatePath)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error", "details": err.Error()})
		return
	}

	htmlStr := string(htmlContent)

	htmlStr = strings.ReplaceAll(htmlStr, "{{email}}", emailBody.Email)

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
		"Subject: Welcome to the Bukowski Newsletter!\r\n\r\n" +
		htmlStr

	err = smtp.SendMail(
		"smtp.gmail.com:587",
		auth,
		bukowskiEmail,
		[]string{emailBody.Email},
		[]byte(msg),
	)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Bad Request", "details": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"sucessful": true, "message": "Sucessfully Subscribed"})
}

func HandleUnsubscribeToNewsletter(ctx *gin.Context) {
	email := strings.ToLower(strings.TrimSpace(ctx.Query("email")))

	if email == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Email is required"})
		return
	}

	var newsletterSubscriber model.NewsletterSubscriber
	result := database.DB.Where("email = ?", email).First(&newsletterSubscriber)
	if result.RowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Email not subscribed"})
		return
	}

	result = database.DB.Unscoped().Delete(&newsletterSubscriber)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unsubscribe", "details": result.Error.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success": true, "message": "Successfully unsubscribed"})
}