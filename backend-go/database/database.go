// package database

// import (
// 	"log"
// 	"os"

// 	model "github.com/moonsungkil/bukowski/models"
// 	"gorm.io/driver/mysql"
// 	"gorm.io/gorm"
// )

// 	var DB *gorm.DB

// 	func ConnectToDB() {
// 		var err error
// 		// dsn := os.Getenv("DB_URL")
// 		dsn := os.Getenv("DB_URL") // Uses the DB_URL from docker-compose.yml
// 		log.Println("Using DB_URL:", dsn)
// 		DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
// 		if err != nil {
// 			log.Fatal(err)
// 		}

// 		if err := DB.AutoMigrate(&model.User{}, &model.Tale{}, &model.Draft{}, &model.TalePurchase{}, &model.NewsletterSubscriber{}, &model.TaleWishlist{}); err != nil {
// 			log.Fatal(err)
// 		}
// 	}

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
	// var err error
	// dsn := os.Getenv("DB_URL")
	// // Retry logic
	// for i := 0; i < 10; i++ { // Retry 10 times
	// 	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	// 	if err == nil {
	// 		break
	// 	}
	// 	log.Printf("Failed to connect to DB, retrying... (%d/10)\n", i+1)
	// 	time.Sleep(5 * time.Second) // Wait for 5 seconds before retrying
	// }

	var err error
	dsn := os.Getenv("DB_URL")
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	if err != nil {
		log.Fatal("Could not connect to the database:", err)
	}

	if err := DB.AutoMigrate(&model.User{}, &model.Tale{}, &model.Draft{}, &model.TalePurchase{}, &model.NewsletterSubscriber{}, &model.TaleWishlist{}); err != nil {
		log.Fatal(err)
	}

	// seeding the genres
	seedGenres()
}


func seedGenres() {
	genres := []string{
		"Western", "Thriller", "Surrealism", "Self-Help", "Science-Fiction", 
		"Science", "Romance", "Religious/Spiritual", "Realism", "Psychology", 
		"Politics", "Poetry", "Philosophy", "Non-Fiction", "Mystery", 
		"Horror", "History", "Fiction", "Fantasy", "Existentialism", 
		"Dystopian", "Drama", "Culture", "Children", "Business", 
		"Biography/Memoir", "Adventure",
	}
	

	for _, genreName := range genres {
		var count int64
		DB.Model(&model.Genre{}).Where("name = ?", genreName).Count(&count)

		if count == 0 {
			DB.Create(&model.Genre{Name: genreName})
			log.Println("Inserted genre:", genreName)
		}
	}
}