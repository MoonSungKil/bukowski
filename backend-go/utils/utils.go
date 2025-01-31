package utils

import (
	"errors"
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