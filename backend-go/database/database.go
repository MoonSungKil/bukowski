package database

import (
	"log"
	"os"

	model "github.com/moonsungkil/bukowski/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectToDB() {
	var err error
	dsn := os.Getenv("DB_URL")
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	if err := DB.AutoMigrate(&model.User{}, &model.Tale{}, &model.TalePurchase{}); err != nil {
		log.Fatal(err)
	}
}	

