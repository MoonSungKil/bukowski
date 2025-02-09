package jobs

import (
	"log"

	"github.com/moonsungkil/bukowski/services"
	"github.com/robfig/cron/v3"
)

func StartNewsletterCron() {
	c := cron.New()

	//Schedule the job every monday at 20:00
	_, err := c.AddFunc("0 20 * * 1" , services.SendNewsletterToSubscribers)
	if err != nil {
		log.Fatal("Failed to Schedule email", err)
	}

	c.Start()
	log.Println("Newsletter cron job started.")

	select{}
}