package model

import (
	"time"

	"gorm.io/gorm"
)

type NewsletterSubscriber struct {
	ID        uint `gorm:"primaryKey"`
	Email     string `json:"email" gorm:"unique;not null" binding:"required,email"`
	CreatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}