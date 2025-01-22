package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/moonsungkil/bukowski/database"
	model "github.com/moonsungkil/bukowski/models"
	"github.com/moonsungkil/bukowski/utils"
	"gorm.io/gorm"
)

func HandleGetAllTalesWithoutAuth(ctx *gin.Context)  {
	var tales []model.Tale
	database.DB.Where("status = ?", "published").Preload("Genres").Find(&tales)
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
	// Extract user ID from JWT claims
	user, exists := ctx.Get("user")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}
	userID := user.(model.User).ID

	// Parse form data fields
	title := ctx.PostForm("title")
	description := ctx.PostForm("description")
	preview := ctx.PostForm("preview")
	content := ctx.PostForm("content")
	author := ctx.PostForm("author")
	pages, _ := strconv.Atoi(ctx.PostForm("pages")) // Convert to int
	price, _ := strconv.ParseFloat(ctx.PostForm("price"), 64)
	status := ctx.PostForm("status")
	publishedAt, _ := time.Parse(time.RFC3339, ctx.PostForm("published_at"))

	// Parse genres JSON string into a slice
	genresJSON := ctx.PostForm("genres")
	var genres []string
	if err := json.Unmarshal([]byte(genresJSON), &genres); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid genres format", "details": err.Error()})
		return
	}

	// Handle image upload
	uploadDir := "../uploads/tale_covers"
	filePath, err := utils.UploadImage(ctx, uploadDir)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image", "details": err.Error()})
		return
	}

	// Create a new tale
	newTale := model.Tale{
		Title:       title,
		Author:      author,
		Description: description,
		Preview:     preview,
		Content:     content,
		Pages:       int64(pages),
		Price:       price,
		Status:      status,
		TaleImage:   filePath,
		PublishedAt: publishedAt,
		UserID:      userID,
	}

	// Add genres to the tale
	for _, genreName := range genres {
		genre := model.Genre{Name: genreName}
		if err := database.DB.Where("name = ?", genreName).FirstOrCreate(&genre).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save genre", "details": err.Error()})
			return
		}
		newTale.Genres = append(newTale.Genres, genre)
	}

	// Save the tale to the database
	if err := database.DB.Create(&newTale).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create tale", "details": err.Error()})
		return
	}

	draftID := ctx.Param("draft_id")
	if draftID  != "" {
		draftIDUint, _ := strconv.ParseUint(draftID, 10, 64)
		result := database.DB.Where("draft_id = ?", draftIDUint).Delete(&model.DraftGenre{})
		if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "cannot delete associated genres"})
		return
	}
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "unable to delete genres", "details": err.Error()})
			return
	}

	result = database.DB.Delete(&model.Draft{}, draftIDUint); if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Unable to delete draft"})
	}
		
	}

	ctx.JSON(http.StatusOK, newTale)
}

func HandleDeleteDraft(ctx *gin.Context) {
	user, err := utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userID := user.ID
	draftID := ctx.Param("draft_id")
	draftIDUint, err := strconv.ParseUint(draftID,10,64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Unable to parse ID"})
		return
	}

	var draft model.Draft
	result := database.DB.First(&draft, draftIDUint)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "no record found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	if userID != draft.UserID {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "not authorized to perform this action"})
		return
	}

	result = database.DB.Where("draft_id = ?", draftIDUint).Delete(&model.DraftGenre{})
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "cannot delete associated genres"})
		return
	}

	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "unable to delete genres"})
		return
	}

	result = database.DB.Delete(&model.Draft{}, draftIDUint)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Succesfully deleted draft", "draft": draft})

}

func HandleCreateDraft(ctx *gin.Context) {
	user, err := utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userID := user.ID

	title := ctx.PostForm("title")
	description := ctx.PostForm("description")
	pages, _ := strconv.Atoi(ctx.PostForm("pages"))
	price, _ := strconv.ParseFloat(ctx.PostForm("price"),64)
	content := ctx.PostForm("content")
	author := ctx.PostForm("author")
	preview := ctx.PostForm("preview")

	genresJSON := ctx.PostForm("genres")
	var genres []string

	if genresJSON == "" {
			genres = nil
	} else {
		if err := json.Unmarshal([]byte(genresJSON), &genres); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid genres format", "details": err.Error()})
			return
		}
	}

	uploadDir := "../uploads/tale_covers"
	var filePath string
	_, err = ctx.FormFile("file")
	if err == nil {
		filePath, err = utils.UploadImage(ctx, uploadDir);
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload Image", "details": err.Error()})
		}
	}
	
	// Create a new draft
	newDraft := model.Draft{
		Title:       title,
		Author:      author,
		Description: description,
		Preview:     preview,
		Content:     content,
		Pages:       int64(pages),
		Price:       price,
		TaleImage:   filePath,
		UserID:      userID,
	}

	for _, genreName := range genres {
		genre := model.Genre{Name: genreName}
		if  err := database.DB.Where("name = ?", genreName).FirstOrCreate(&genre).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save genre", "details": err.Error()})
			return
		}
		newDraft.Genres = append(newDraft.Genres, genre)
	}

	if err := database.DB.Create(&newDraft).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create draft", "details": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, newDraft)

}



func HandleGetAllDraftByUserId(ctx *gin.Context) {
	user, err :=utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userID := user.ID
	var drafts []model.Draft
	database.DB.Where("user_id = ?", userID).Preload("Genres").Unscoped().Find(&drafts)
	ctx.JSON(http.StatusOK, drafts)
}

func HandleGetSingleDraft(ctx *gin.Context) {
	user, err := utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userID := user.ID

	var userFound model.User
	result := database.DB.Preload("PublishedTales").Preload("PublishedTales.Genres").Unscoped().First(&userFound, userID);
	if result.RowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found", "details:": result.Error.Error()})
		return
	}

	taleID := ctx.Param("id")
	taleIDUint, err := strconv.ParseUint(taleID,10,64);
	if err !=nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var draft model.Draft
	result = database.DB.Where("user_id = ? AND id = ?", userID, taleIDUint).Preload("Genres").First(&draft)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Tale not found"})
		return
	}

	ctx.JSON(http.StatusOK, draft)
}

func HandleGetAllTalesPublishedByUserId(ctx *gin.Context) {
	user, err := utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userID := user.ID

	var tales []model.Tale
	database.DB.Where("user_id = ? AND status = ?", userID, "published").Preload("Genres").Unscoped().Find(&tales)
	ctx.JSON(http.StatusOK, tales)
}

func HandleGetAllTalesDraftedByUserId(ctx *gin.Context) {
	user, err := utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userID := user.ID

	var tales []model.Tale
	database.DB.Where("user_id = ? AND status = ?", userID, "draft").Preload("Genres").Unscoped().Find(&tales)
	ctx.JSON(http.StatusOK, tales)
}

func HandleUpdateDraft(ctx *gin.Context) {
	user, err := utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}
	userID := user.ID

	draftIDFromParam := ctx.Param("draft_id")
	draftID, err := strconv.ParseInt(draftIDFromParam,10,64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var draftToUpdate model.Draft
	result := database.DB.Preload("Genres").First(&draftToUpdate, draftID)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error", "details": result.Error.Error()})
		return
	}

	if userID != draftToUpdate.UserID {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "not authorized to perform this action"})
		return
	}

	if result.RowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Draft not found"})
		return
	}

	form, err := ctx.MultipartForm()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data format", "details": err.Error()})
		return
	}

	formData := make(map[string]string)
	for key, value := range form.Value {
		if len(value) > 0 {
			formData[key] = value[0]
		}
	}

	for key, value := range formData {
		fmt.Printf("Processing key: %v, value: %v pairs:", key, value)
		switch key {
		case "title":
			draftToUpdate.Title = value
		case "content":
			draftToUpdate.Content = value
		case "description":
			draftToUpdate.Description = value
		case "price":
			parsedValueForPrice, _ := strconv.ParseFloat(value,64)
			draftToUpdate.Price = parsedValueForPrice
		case "pages":
			parsedValueForPages, _ := strconv.ParseInt(value,10,64)
			draftToUpdate.Pages = parsedValueForPages
		case "preview":
			draftToUpdate.Preview = value
		case "author":
			draftToUpdate.Author = value
		case "genres":
			var genres []string
			if err := json.Unmarshal([]byte(value),&genres); err != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid genre format", "details": err.Error()})
				return
			}
			result := database.DB.Where("draft_id = ?", draftID).Delete(&model.DraftGenre{})
			if result.Error != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "cannot delete asssociated genres"})
				return
			}
			draftToUpdate.Genres = []model.Genre{}
			for _, genreName := range genres {
				genre := model.Genre{Name: genreName}
				if err := database.DB.Where("name = ?", genreName).FirstOrCreate(&genre).Error; err != nil {
					ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save genre", "details": err.Error()})
					return
				}
				draftGenre := model.DraftGenre{
					DraftID: draftToUpdate.ID,
					GenreID: genre.ID,
				}
				if err := database.DB.Create(&draftGenre).Error; err != nil {
					ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to associate genres", "details": err.Error()})
					return
				}
				draftToUpdate.Genres = append(draftToUpdate.Genres, genre)
			}
		default:
			fmt.Printf("Unrecogniyed key: %s\n", key)
		}
	}

	_, ok := form.File["file"];
	if ok {
		uploadDir := "../uploads/tale_covers"
		filePath, err := utils.UploadImage(ctx, uploadDir)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image", "details": err.Error()})
			return
		}
		draftToUpdate.TaleImage = filePath
	}

	result = database.DB.Save(&draftToUpdate)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update draft", "details": result.Error.Error()})
		return
	}

	ctx.JSON(http.StatusOK, draftToUpdate)
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

	if !tale.DeletedAt.Time.IsZero() || tale.Status == "archived" {
		tale.DeletedAt = gorm.DeletedAt{} // setting the deleteAt value to nil
		tale.Status = "published"

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