package services

import (
	"log"
	"net/smtp"
	"os"
	"path/filepath"
	"strings"

	"github.com/moonsungkil/bukowski/database"
	model "github.com/moonsungkil/bukowski/models"
)

func SendNewsletterToSubscribers() {
	var newsletterSubscribers []model.NewsletterSubscriber
	result := database.DB.Find(&newsletterSubscribers)
	if result.Error != nil {
		log.Println("Error fetching subscribers:", result.Error)
		return
	}

	if result.RowsAffected == 0 {
		log.Println("No subscribers found")
		return
	}


	basePath, _ := os.Getwd()
	templatePath := filepath.Join(basePath, "email_templates", "newsletter_template.html")
	htmlContent, err := os.ReadFile(templatePath)
	if err != nil {
		log.Println("Error reading email template:", err)
		return
	}

	for _, subscriber := range newsletterSubscribers {
		htmlStr := strings.ReplaceAll(string(htmlContent), "{{email}}", subscriber.Email )

		emailAddresses := []string{subscriber.Email}

		bukowskiEmail := os.Getenv("NL_EMAIL")
		bukowskiAppPass := os.Getenv("NL_APP_PASS")

		auth := smtp.PlainAuth(
			"",
			bukowskiEmail,
			bukowskiAppPass,
			"smtp.gmail.com",
		)

		msg := "MIME-Version: 1.0\r\n" +
			"Content-Type: text/html; charset=\"UTF-8\"\r\n" +
			"Subject: Bukowski Weekly Newsletter!\r\n\r\n" +
			htmlStr

		err = smtp.SendMail(
			"smtp.gmail.com:587",
			auth,
			bukowskiEmail,
			emailAddresses,
			[]byte(msg),
		)
		
		if err != nil {
			log.Println("Error sending email:", err)
			return
		}

	log.Println("Newsletter sent successfully to", subscriber.Email)

	}

}