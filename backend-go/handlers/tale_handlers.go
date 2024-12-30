package handlers

import (
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/moonsungkil/bukowski/database"
	model "github.com/moonsungkil/bukowski/models"
	"github.com/moonsungkil/bukowski/types"
	"github.com/moonsungkil/bukowski/utils"
	"gorm.io/gorm"
)

func HandleGetAllTalesWithoutAuth(ctx *gin.Context)  {
	var tales []model.Tale
	database.DB.Preload("Genres").Find(&tales)
	ctx.JSON(http.StatusOK, tales)
}

func HandleGetSingleTaleWithouthAuth(ctx *gin.Context) {
	var tale model.Tale
	taleId := ctx.Param("id")

	taleIdUint, err := strconv.ParseUint(taleId,10,64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid error format"})
	}

	database.DB.Preload("Genres").First(&tale, taleIdUint);
	ctx.JSON(http.StatusOK, tale)

}

func HandleCreateTale(ctx *gin.Context) {
	//extract the User ID from the JWT claims
	user, exists := ctx.Get("user")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userID := user.(model.User).ID

	var taleBody types.TaleBody
	if err := ctx.ShouldBindJSON(&taleBody); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Bad Request", "details": err.Error()})
		return
	}

	newTale := model.Tale{
		Title: taleBody.Title,
		Author: taleBody.Author,
		Description: taleBody.Description,
		Preview: taleBody.Preview,
		Content: taleBody.Content,
		Pages: taleBody.Pages,
		Price: taleBody.Price,
		PublishedAt: taleBody.PublishedAt,
		UserID: userID,
	} 

	for _, genreName := range taleBody.Genres {
		genre := model.Genre{Name: genreName}
		if err := database.DB.Where("name = ?", genreName).FirstOrCreate(&genre).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error", "details": err.Error()})
		}
		newTale.Genres = append(newTale.Genres, genre)
	}

	result := database.DB.Create(&newTale)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error", "details": result.Error.Error()})
		return
	}
	
	ctx.JSON(http.StatusOK, newTale)

}

func HandleGetAllTalesPublishedByUserId(ctx *gin.Context) {
	user, err := utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userID := user.ID

	var tales []model.Tale
	database.DB.Where("user_id = ?", userID).Preload("Genres").Unscoped().Find(&tales)
	ctx.JSON(http.StatusOK, tales)
}

func HandleGetSingleTalePublishedById(ctx *gin.Context) {
	userReq, exists := ctx.Get("user")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userId := userReq.(model.User).ID

	taleId := ctx.Param("id")

	taleIDUint, err := strconv.ParseUint(taleId,10,64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var user model.User
	result := database.DB.Preload("PublishedTales").Preload("PublishedTales.Genres").Unscoped().First(&user, userId);
	if result.RowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found", "details:": result.Error.Error()})
		return
	}

	taleFound := false
	var tale model.Tale
	for _, t := range user.PublishedTales {
		if t.ID == uint(taleIDUint) {
				tale.ID = t.ID
				tale.CreatedAt = t.CreatedAt
				tale.UpdatedAt = t.UpdatedAt
				tale.DeletedAt = t.DeletedAt
				tale.Title = t.Title
				tale.Author = t.Author
				tale.Description = t.Description
				tale.Preview = t.Preview
				tale.Content = t.Content
				tale.Pages = t.Pages
				tale.Price = t.Price
				tale.Genres = t.Genres
				tale.PublishedAt = t.PublishedAt
				taleFound = true
				break
		}
	}

	if !taleFound {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "no access to this tale"})
		return
	}

	ctx.JSON(http.StatusOK, tale)
}

func HandlePurchaseTale(ctx *gin.Context) {
	user, err := utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userID := user.ID
	taleIDFromParams := ctx.Param("id")
	toBePurchasedTaleID, err := strconv.ParseUint(taleIDFromParams, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}
	
	var tale model.Tale
	result := database.DB.Preload("Genres").First(&tale, toBePurchasedTaleID)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	if result.RowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "No tale found with that ID"})
		return
	}

	if userID == tale.UserID {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "unable to purchase own records"})
		return
	}

	var alreadyPurchasedTales []model.TalePurchase
	database.DB.Where("purchaser_user_id = ?", userID).Find(&alreadyPurchasedTales)
	for _, alreadyPurchased := range alreadyPurchasedTales {
		if alreadyPurchased.TaleID == uint(toBePurchasedTaleID) {
			ctx.JSON(http.StatusConflict, gin.H{"error": "Tale already purchased"})
			return
		}
	}

	newPurchase := model.TalePurchase{
		TaleID: tale.ID,
		PurchaserUserID: userID,
		PurchaseDate: time.Now(),
	}

	createResult := database.DB.Create(&newPurchase)
	if createResult.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to purchase tale"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "succesfully purchased tale", "tale": newPurchase})
}

func HandleGetAllTalesPurchasedByUserId(ctx *gin.Context) {
	user, err := utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userID := user.ID

	var tales []model.Tale
	result := database.DB.Joins("JOIN tale_purchases ON tales.id = tale_purchases.tale_id").Where("tale_purchases.purchaser_user_id = ?", userID).Preload("Genres").Unscoped().Find(&tales)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}
	if result.RowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"message": "No results found"})
		return
	}

	if len(tales) == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"message": "No results found"})
		return
	}

	ctx.JSON(http.StatusOK, tales)

}

func HandleGetPurchasedTaleByID(ctx *gin.Context) {
	user, err := utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userID := user.ID
	taleIDFromParams := ctx.Param("id")

	var tale model.Tale
	result := database.DB.Joins("JOIN tale_purchases ON tales.id = tale_purchases.tale_id").Where("tale_purchases.purchaser_user_id = ? AND tale_purchases.tale_id = ?", userID, taleIDFromParams).Preload("Genres").Unscoped().First(&tale)
	if result.Error != nil  {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "no access to this tale"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error", "details": result.Error.Error()})
		return
	}

	ctx.JSON(http.StatusOK, tale)
}

func HandleSoftDeleteTaleByUserID(ctx *gin.Context) {
	user, err := utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userID := user.ID
	taleID := ctx.Param("id")

	var tale model.Tale
	result := database.DB.First(&tale,taleID)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "no record found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	if userID != tale.UserID {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "not authorized to perform this action"})
		return
	}

	result = database.DB.Model(&model.Tale{}).Where("id = ?", taleID).Update("is_active", false)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}
	result = database.DB.Delete(&model.Tale{}, taleID)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Succesfully delete tale", "tale deleted": tale})
}

func HandlePermanentDeleteTaleByUserID(ctx *gin.Context) {
	// not working, no use case yet
	user, err := utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userID := user.ID
	taleIDFromParams := ctx.Param("id")

	taleID, err := strconv.ParseUint(taleIDFromParams,10,64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid ID format", "details": err.Error()})
		return
	}

	var tale model.Tale
	result := database.DB.Unscoped().First(&tale,taleID)


	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "no record found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	if userID != tale.UserID {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "not authorized to perform this action"})
		return
	}

	err = utils.DeleteAssociatedGenres(uint(taleID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "unable to delete genres", "details": err.Error()})
		return
	}
	
	result = database.DB.Unscoped().Delete(&model.Tale{}, taleID)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Succesfully permanently delete tale", "tale deleted": tale})
}

func HandleActiveTaleByUserId(ctx *gin.Context) {
	user, err := utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userID := user.ID
	taleIDFromParams := ctx.Param("id")
	taleID, err := strconv.ParseUint(taleIDFromParams, 10,64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid ID format", "details": err.Error()})
		return
	}
	
	var tale model.Tale
	result := database.DB.Where("id = ? AND user_id = ?", taleID, userID).Unscoped().First(&tale)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "tale not found, or user no access to tale", "details": result.Error.Error()})
		return
	}

	if !tale.DeletedAt.Time.IsZero() || !tale.IsActive{
		tale.DeletedAt = gorm.DeletedAt{} // setting the deleteAt value to nil
		tale.IsActive = true

		result := database.DB.Save(&tale)
		if result.Error != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error", "details": result.Error.Error()})
			return
		}
	} else {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "tale already active"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Tale back active", "tale": tale})
}