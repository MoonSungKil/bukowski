package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
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
	database.DB.Where("is_active = ?", true).Preload("Genres").Omit("content").Find(&tales)

	var talesUnauthorized []types.TaleBodyUnauthorized

	for _, tale := range tales {
		talesUnauthorized = append(talesUnauthorized, types.TaleBodyUnauthorized{
			ID:          tale.ID,
			Title:       tale.Title,
			Author:      tale.Author,
			Description: tale.Description,
			Preview:     tale.Preview,
			Pages:       tale.Pages,
			Price:       tale.Price,
			Genres:      tale.Genres,
			TaleImage:   tale.TaleImage,
			PublishedAt: tale.PublishedAt,
		})
	}

	ctx.JSON(http.StatusOK, gin.H{"success":true, "tales": talesUnauthorized})
}

func HandleGetSingleTaleWithouthAuth(ctx *gin.Context) {
	var tale model.Tale
	taleId := ctx.Param("id")

	taleIdUint, err := strconv.ParseUint(taleId,10,64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid error format"})
		return
	}

	result := database.DB.Preload("Genres").Omit("content").First(&tale, taleIdUint);
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid error format"})
		return
	}

	if result.RowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Tale not found"})
		return
	}

	taleUnauthorized := types.TaleBodyUnauthorized{
		ID:          tale.ID,
		Title:       tale.Title,
		Author:      tale.Author,
		Description: tale.Description,
		Preview:     tale.Preview,
		Pages:       tale.Pages,
		Price:       tale.Price,
		Genres:      tale.Genres,
		TaleImage:   tale.TaleImage,
		PublishedAt: tale.PublishedAt,
		Rating: tale.Rating,
	}

	ctx.JSON(http.StatusOK, gin.H{"success": true, "tale": taleUnauthorized})

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
	if title == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"success":false,"error": "Title field is required", "field": "title"})
		return
	}
	description := ctx.PostForm("description")
	if description == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"success":false,"error": "Description field is required", "field": "description"})
		return
	}
	preview := ctx.PostForm("preview")
	if preview == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"success":false,"error": "Preview field is required", "field": "preview"})
		return
	}
	content := ctx.PostForm("content")
	if content == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"success":false,"error": "Content field is required", "field": "content"})
		return
	}
	author := ctx.PostForm("author")
	if author == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"success":false,"error": "Author field is required", "field": "author"})
		return
	}
	pages, err := strconv.Atoi(ctx.PostForm("pages")) // Convert to int
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"success":false,"error": "Pages field is required", "field": "pages"})
		return
	}
	price, err := strconv.ParseFloat(ctx.PostForm("price"), 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"success":false,"error": "Price field is required", "field": "price"})
		return
	}
	status := ctx.PostForm("status")
	if status == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"success":false,"error": "Status field is required", "field": "status"})
		return
	}
	publishedAt, _ := time.Parse(time.RFC3339, ctx.PostForm("published_at"))
	

	// Parse genres JSON string into a slice
	genresJSON := ctx.PostForm("genres")
	var genres []string
	if err := json.Unmarshal([]byte(genresJSON), &genres); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid genres format", "details": err.Error()})
		return
	}

	//Handle Upload File
	file, err := ctx.FormFile("file")
	var pathUrl string 
	var draft model.Draft
	draftID := ctx.Param("draft_id")
	draftIDUint, _ := strconv.ParseInt(draftID,10,64)
	_ = database.DB.Where("id = ? AND user_id = ?", draftIDUint, userID).First(&draft)
	if err != nil {
		if draft.TaleImage != "" {
			publicID := utils.ExtractPublicID(draft.TaleImage)
			pathParts := strings.Split(publicID, "/")
			justImageName := pathParts[len(pathParts) -1]
			pathUrl, err = utils.MoveImage("bukowski_draft_images", "bukowski_tale_images", justImageName)
			if err != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "Upload Failed"})
				return
			}
		} else {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Unable to retrive image from form"})
			return
		}
	} else {
		// Open the file to get the content
		fileContent, err := file.Open()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
   	 		return
		}
		defer fileContent.Close()
	
		folderName := "bukowski_tale_images"
		pathUrl, err = utils.UploadImageToCloudinary(folderName, fileContent)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Unable to retrive image from form"})
			return
		}
		
		// delete the unused draft image if it exists
		if draft.TaleImage != "" {
			publicID := utils.ExtractPublicID(draft.TaleImage)
			_, err := utils.DeleteImage(publicID); if err != nil {
				ctx.JSON(http.StatusInternalServerError,gin.H{"error": "Unable to delete old draft Image"})
				return
			}
		}
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
		TaleImage:   pathUrl,
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

	if draftID  != "" {
		draftIDUint, _ := strconv.ParseInt(draftID,10,64)
		result := database.DB.Where("draft_id = ?", draftIDUint).Delete(&model.DraftGenre{})
		if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "cannot delete associated genres"})
		return
	}
	

	result = database.DB.Delete(&model.Draft{}, draftIDUint); if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Unable to delete draft"})
	}
		
	}

	ctx.JSON(http.StatusOK, gin.H{"sucess":true, "tale":newTale, "message": "Tale sucessfuly Published"})
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
	if result.Error == nil {
		if draft.TaleImage != "" {
			draftImagePath := draft.TaleImage
			draftImagePath = filepath.Join("..", draftImagePath)
			err := os.Remove(draftImagePath)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Draft deleted but image still intact"})
				return
			}
		}
	}
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

	form, _ := ctx.MultipartForm()

	title := ctx.PostForm("title")
	description := ctx.PostForm("description")
	pages, _ := strconv.Atoi(ctx.PostForm("pages"))
	price, _ := strconv.ParseFloat("0",64)
	if _, exists := form.Value["price"]; exists {
		price,_  = strconv.ParseFloat(ctx.PostForm("price"),64)
	}
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

	// uploadDir := "../uploads/draft_covers"
	// var filePath string
	// _, err = ctx.FormFile("file")
	// if err == nil {
	// 	filePath, err = utils.UploadImage(ctx, uploadDir);
	// 	if err != nil {
	// 		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload Image", "details": err.Error()})
	// 	}
	// }

	folderName := "bukowski_draft_images"
	var filePath string
	file, err := ctx.FormFile("file")
	if err == nil {
		fileContent, err := file.Open()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
   	 	return
		}
		defer fileContent.Close()
		filePath, err = utils.UploadImageToCloudinary(folderName, fileContent)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to Upload Image"})
		}
	// } else {
	// 	filePath = "https://res.cloudinary.com/dscuqiqmz/image/upload/v1739617686/bukowski_draft_images/tale_placeholder.jpg"
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

	ctx.JSON(http.StatusOK, gin.H{"sucess":true, "draft":newDraft, "message": "Draft sucessfuly created"})
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
	ctx.JSON(http.StatusOK, gin.H{"success": true, "drafts": drafts})

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

	ctx.JSON(http.StatusOK, gin.H{"sucess": true, "draft": draft})
}

func HandleGetAllTalesPublishedByUserId(ctx *gin.Context) {
	user, err := utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userID := user.ID

	var tales []model.Tale
	result := database.DB.Where("user_id = ?", userID).Preload("Genres").Unscoped().Find(&tales)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}
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
				draftToUpdate.Genres = append(draftToUpdate.Genres, genre)
			}
		default:
			fmt.Printf("Unrecogniyed key: %s\n", key)
		}
	}

	// _, ok := form.File["file"];
	// if ok {
	// 	uploadDir := "../uploads/draft_covers"
	// 	filePath, err := utils.UploadImage(ctx, uploadDir)
	// 	if err != nil {
	// 		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image", "details": err.Error()})
	// 		return
	// 	}
	// 	if draftToUpdate.TaleImage != "" {
	// 		oldImageFilePath := draftToUpdate.TaleImage
	// 		oldImageFilePath = filepath.Join("..", oldImageFilePath)
	// 		if err = os.Remove(oldImageFilePath); err != nil {
	// 			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "unable to delete old image", "details": err.Error(), "path": oldImageFilePath})
	// 			return
	// 		}
	// 	}
	// 	draftToUpdate.TaleImage = filePath
	// }

	file, err := ctx.FormFile("file")
	if err == nil {
		fileContent, err := file.Open()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
			return
		}
		defer fileContent.Close()

		folderName := "bukowski_draft_images"
		filePath, err := utils.UploadImageToCloudinary(folderName,fileContent)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to Upload Image"})
			return
		}

		if draftToUpdate.TaleImage != "" {
			oldImagePath := draftToUpdate.TaleImage
			oldPublicID := utils.ExtractPublicID(oldImagePath)
			_, err = utils.DeleteImage(oldPublicID)
			if err != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "Deleting Image Failed"})
				return
			}
		}

		draftToUpdate.TaleImage = filePath
	}
	

	result = database.DB.Save(&draftToUpdate)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update draft", "details": result.Error.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"sucess":true, "draft":draftToUpdate, "message": "Draft updated/saved"})
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
				tale.TaleImage = t.TaleImage
				tale.Rating = t.Rating
				taleFound = true
				break
		}
	}

	if !taleFound {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "no access to this tale"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success": true, "tale": tale})
}

func HandleAddToWishlistTaleById(ctx *gin.Context) {
	user, err := utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userID := user.ID
	taleIDFromParams := ctx.Param("id")
	tobeAddedToWishlistTaleID, err := strconv.ParseUint(taleIDFromParams, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var tale model.Tale
	result := database.DB.Preload("Genres").First(&tale, tobeAddedToWishlistTaleID)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	if result.RowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error" : "No tale found"})
		return
	}

	if userID == tale.UserID {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "tale owned by you"})
		return
	}

	var talesAlreadyInWishlist []model.TaleWishlist
	database.DB.Where("wishlist_user_id = ?", userID).Find(&talesAlreadyInWishlist)
	for _, alreadyInWishlisth := range talesAlreadyInWishlist {
		if alreadyInWishlisth.TaleID == tale.ID {
			ctx.JSON(http.StatusConflict, gin.H{"error": "Tale already in your wishlist"})
			return
		}
	}

	var alreadyPurchasedTales []model.TalePurchase
	database.DB.Where("purchaser_user_id = ?", userID).Find(&alreadyPurchasedTales)
	for _, alreadyPurchased := range alreadyPurchasedTales {
		if alreadyPurchased.TaleID == uint(tobeAddedToWishlistTaleID) {
			ctx.JSON(http.StatusConflict, gin.H{"error": "Tale already purchased"})
			return
		}
	}

	newWishlist := model.TaleWishlist{
		TaleID: tale.ID,
		WishlistUserID: userID,
		Title: tale.Title,
		TaleImage: tale.TaleImage,
	}

	result = database.DB.Create(&newWishlist)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add to wishlist", "details": result.Error.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Successfully added to wishlist", "tale": tale})
}

func HandleRemoveFromWishlist(ctx *gin.Context) {
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
	}

	var wishlistedTaleToRemove model.TaleWishlist
	result := database.DB.Where("wishlist_user_id = ? AND tale_id = ?", userID, toBePurchasedTaleID).Find(&wishlistedTaleToRemove)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error", "details": result.Error.Error()})
		return
	}

	if result.RowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "No such tale in your wishlist"})
		return
	}

	result = database.DB.Delete(&wishlistedTaleToRemove)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to remove wishlisted tale"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Removed from Wishlist", "removed_tale_id": taleIDFromParams })

}


func HandleGetAllWishlistedTalesByUserId(ctx *gin.Context) {
	user, err := utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	userID := user.ID

	var wishlistedTales []model.TaleWishlist
	result := database.DB.Where("wishlist_user_id = ?",userID).Find(&wishlistedTales)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error", "details": result.Error.Error()})
		return
	}

	var taleIDs []uint
	for _, wishtale := range wishlistedTales {
		taleIDs = append(taleIDs, wishtale.TaleID)
	}

	var tales []model.Tale
	if len(taleIDs) > 0 {
		result = database.DB.Select("id", "title", "tale_image").Where("id IN (?)", taleIDs).Find(&tales)
		if result.Error != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error", "details": result.Error.Error()})
			return
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"tales": tales})
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

	var foundUser model.User
	result = database.DB.First(&foundUser, userID);
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Unable to find user with that ID"})
		return
	}

	if foundUser.Balance < tale.Price {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Not enough balance to purchase"})
		return
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

	newBalance := foundUser.Balance - tale.Price
	foundUser.Balance = math.Round(newBalance*100) / 100
	updateUserBalanceResult := database.DB.Save(&foundUser)
	if updateUserBalanceResult.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to Update Balance"})
		return
	}

	var wishlistedTale model.TaleWishlist
	result = database.DB.Where("wishlist_user_id = ? AND tale_id = ?", userID, toBePurchasedTaleID).First(&wishlistedTale)

	if result.RowsAffected != 0 {
		result = database.DB.Delete(&wishlistedTale)
		if result.Error != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to remove tale from wishlist"})
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Succesfully purchased tale", "tale": newPurchase, "balance": foundUser.Balance})
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

	ctx.JSON(http.StatusOK, gin.H{"success":true, "tale": tale})
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

	ctx.JSON(http.StatusOK, gin.H{"message": "Succesfully delete tale", "tale_deleted": tale})
}

func HandlePermanentDeleteTaleByUserID(ctx *gin.Context) {
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
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error", })
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

	if !tale.DeletedAt.Time.IsZero()  {
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

func HandleGetAllGenres(ctx *gin.Context) {
	var genres []model.Genre
	if err := database.DB.Find(&genres).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Unable to fetch genres"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"sucess": true, "genres": genres})
}

func HandleSubmitTaleRating(ctx *gin.Context) {
	user, err := utils.CheckIfAuthorizedAndGetUserFromReq(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	var input types.RatingInput 
	err = ctx.ShouldBind(&input)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid rating format"})
		return
	}

	userID := user.ID
	taleId := ctx.Param("id")
	taleIdUint, err := strconv.ParseUint(taleId,10,64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid error format"})
		return
	}

	var pruchasedTale model.TalePurchase
	result := database.DB.Where("purchaser_user_id = ? AND tale_id = ?",userID,taleIdUint).First(&pruchasedTale)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "not eligible to rate tale"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	pruchasedTale.UserRating = input.Rating
	result = database.DB.Save(&pruchasedTale)
	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save/update rating"})
		return
	}


	taleRating, err := utils.UpdateTaleRating(ctx, uint(taleIdUint), uint(userID), pruchasedTale.UserRating)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Rating Submitted", "user_rating": pruchasedTale.UserRating, "tale_rating": taleRating})
}

