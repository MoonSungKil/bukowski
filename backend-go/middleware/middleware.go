package middleware

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/moonsungkil/bukowski/database"
	user_model "github.com/moonsungkil/bukowski/models"
)

func RequireAuth(ctx *gin.Context) {
	// get the cookie off the request
	tokenString, err := ctx.Cookie("Authorization")

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized", "details": err.Error()})
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	//Decode / Validate
	token, _ := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method %v", token.Header["alg"])
		}
	return []byte(os.Getenv("SECRET")), nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// check the expiry date
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized", "details": "session timed out"})
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}	

	var user user_model.User
	result := database.DB.First(&user, claims["sub"])

	if user.ID == 0 {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized", "details": "no user found"})
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	if result.RowsAffected == 0 {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized", "details": "no user found"})
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	//Attach the request
	ctx.Set("user", user)

	//Continue
	ctx.Next()
	} else {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}
}

func PreventLoginIfAuthenticated(ctx *gin.Context) {
	_, err := ctx.Cookie("Authorization")
	if err != nil {
		ctx.Next()
		return
	}

	ctx.JSON(http.StatusBadRequest, gin.H{"error": "Already Authorized/Logged In"})
	ctx.AbortWithStatus(http.StatusBadRequest)
}

func DeleteCookie(ctx *gin.Context, name string)  {
	ctx.SetCookie(name, "", -1, "", "", false, true)
	ctx.JSON(http.StatusOK, gin.H{"message": "Cookie deleted"})
}

func CORSMiddleware() gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders: []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge: 12*time.Hour,
	})
}