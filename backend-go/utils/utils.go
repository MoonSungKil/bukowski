package utils

import (
	"errors"

	"github.com/gin-gonic/gin"
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