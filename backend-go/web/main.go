package main

import (
	"github.com/gin-gonic/gin"
	"github.com/moonsungkil/bukowski/database"
	handlers "github.com/moonsungkil/bukowski/handlers"
	"github.com/moonsungkil/bukowski/initializers"
	"github.com/moonsungkil/bukowski/jobs"
	"github.com/moonsungkil/bukowski/middleware"
	"github.com/moonsungkil/bukowski/utils"
)


func init() {
	initializers.LoadEnvVariables()
	database.ConnectToDB()
	utils.InitCloudinary()
}

func main() {
	router := gin.Default()

	go jobs.StartNewsletterCron()

	router.Static("/uploads", "../uploads")
	router.Use(middleware.CORSMiddleware())
	
	preventLoginGroup := router.Group("/")
	preventLoginGroup.Use(middleware.PreventLoginIfAuthenticated)

	requireAuthGroup := router.Group("/")
	requireAuthGroup.Use(middleware.RequireAuth)

	preventLoginGroup.POST("/users/register", handlers.HandleCreateUser)
	preventLoginGroup.POST("/users/login", handlers.HandleLoginUser)
	requireAuthGroup.POST("/users/logout", handlers.HandleLogoutUser)
	requireAuthGroup.GET("/users/", handlers.HandleGetAllUsers)
	requireAuthGroup.GET("/users/:id", handlers.HandleGetSingleUser)
	requireAuthGroup.DELETE("/users/soft_delete/:id", handlers.HandleSoftDeleteSingleUser)
	requireAuthGroup.DELETE("/users/permanent_delete/:id", handlers.HandlePermanentDeleteSingleUser)
	requireAuthGroup.PUT("/users/update_info/:id",handlers.HandleUpdateUserInformation)
	requireAuthGroup.PUT("/users/update_profile_picture/:id",handlers.HandleUpdateUserProfilePicture)
	requireAuthGroup.PUT("/users/update_password/:id", handlers.HandleUpdateUserPassword)
	requireAuthGroup.GET("/users/test", handlers.Test)
	requireAuthGroup.DELETE("/users/delete_authorization_cookie", handlers.HandleDeleteAuthorizationCookie)

	requireAuthGroup.POST("/tales/create", handlers.HandleCreateTale)
	requireAuthGroup.POST("/tales/convert_draft_to_tale/:draft_id", handlers.HandleCreateTale)
	requireAuthGroup.PUT("/tales/update_draft/:draft_id", handlers.HandleUpdateDraft)
	requireAuthGroup.DELETE("/tales/delete_draft/:draft_id", handlers.HandleDeleteDraft)
	requireAuthGroup.POST("/tales/create_draft", handlers.HandleCreateDraft)
	requireAuthGroup.GET("/tales/get_all_published", handlers.HandleGetAllTalesPublishedByUserId)
	requireAuthGroup.GET("/tales/get_single_draft/:id", handlers.HandleGetSingleDraft)
	requireAuthGroup.GET("/tales/get_all_drafts", handlers.HandleGetAllDraftByUserId)
	requireAuthGroup.GET("/tales/published/:id", handlers.HandleGetSingleTalePublishedById)
	requireAuthGroup.GET("/tales/get_all_purchased", handlers.HandleGetAllTalesPurchasedByUserId)
	requireAuthGroup.POST("/tales/purchase/:id", handlers.HandlePurchaseTale)
	requireAuthGroup.GET("/tales/get_all_wishlisted", handlers.HandleGetAllWishlistedTalesByUserId)
	requireAuthGroup.POST("/tales/add_to_wishlist/:id", handlers.HandleAddToWishlistTaleById)
	requireAuthGroup.DELETE("/tales/delete_tale_from_wishlist/:id", handlers.HandleRemoveFromWishlist)
	requireAuthGroup.GET("/tales/purchased/:id", handlers.HandleGetPurchasedTaleByID)
	requireAuthGroup.DELETE("/tales/soft_delete/:id", handlers.HandleSoftDeleteTaleByUserID)
	requireAuthGroup.DELETE("/tales/permanent_delete/:id", handlers.HandlePermanentDeleteTaleByUserID)
	requireAuthGroup.PUT("/tales/activate_tale/:id", handlers.HandleActiveTaleByUserId)
	requireAuthGroup.PUT("/tales/submit_rating/:id", handlers.HandleSubmitTaleRating)

	router.GET("/tales/get_tales", handlers.HandleGetAllTalesWithoutAuth)
	router.GET("/tales/get_tales/:id", handlers.HandleGetSingleTaleWithouthAuth)
	router.GET("/tales/get_genres", handlers.HandleGetAllGenres)

	router.POST("/newsletter/subscribe", handlers.HandleSubscribeToNewsletter)

	router.Run()
}