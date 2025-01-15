package utils

import (
	"errors"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
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
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to retrive file"})
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
		ctx.JSON(http.StatusInternalServerError, gin.H{"erro": "Fiailed to save file" })
		return "", err
	}

	relativePath := "/uploads/profile_pictures/" + newFileName
	return relativePath, nil
}