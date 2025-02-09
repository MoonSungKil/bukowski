package services

import (
	"log"
	"net/smtp"
	"os"

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
		log.Println("No subscribers founNewsletterSubscriber")
		return
	}

	htmlContent, err := os.ReadFile("../email_templates/newsletter_template.html")
	if err != nil {
		log.Println("Error reading email template:", err)
		return
	}

	var emailAddresses []string
	for _, subscriber := range newsletterSubscribers {
		emailAddresses = append(emailAddresses, subscriber.Email)
	}

	if len(emailAddresses) == 0 {
		log.Println("No subscribers found")
		return
	}

	bukowskiEmail := os.Getenv("NL_EMAIL")
	bukowskiAppPass := os.Getenv("NL_APP_PASS")

	auth := smtp.PlainAuth(
		"",
		bukowskiEmail,
		bukowskiAppPass,
		"smtp.gmail.com",
	)

	// msg := "MIME-Version: 1.0\r\n" +
	// 	"Content-Type: text/html; charset=\"UTF-8\"\r\n" +
	// 	"To" + strings.Join(emailAddresses, ",") + "\r\n" +
	// 	"Subject: Bukowski Weekly Newsletter!\r\n\r\n" +
	// 	string(htmlContent)

	msg := "MIME-Version: 1.0\r\n" +
		"Content-Type: text/html; charset=\"UTF-8\"\r\n" +
		"Subject: Bukowski Weekly Newsletter!\r\n\r\n" +
		string(htmlContent)

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

	log.Println("Newsletter sent successfully")
}