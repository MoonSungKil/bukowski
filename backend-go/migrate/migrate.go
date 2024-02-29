package main

import (
	"log"

	"github.com/moonsungkil/bukowski/database"
	"github.com/moonsungkil/bukowski/initializers"
	user_model "github.com/moonsungkil/bukowski/models"
)

func init() {
	initializers.LoadEnvVariables()
	database.ConnectToDB()
}

func main() {
	err := database.DB.AutoMigrate(&user_model.User{})
	if err != nil {
		log.Fatal(err)
	}
}