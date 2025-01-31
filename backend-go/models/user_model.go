package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint      `gorm:"primaryKey"`
    CreatedAt time.Time
    UpdatedAt time.Time
    DeletedAt gorm.DeletedAt `gorm:"index"`
    Username  string `json:"username" gorm:"unique;not null;" binding:"required,min=3,max=15"`
    Email     string `json:"email" gorm:"unique;not null" binding:"required,email"`
    Password  string `json:"password" gorm:"not null;" binding:"required,min=8,max=16"`
    ProfilePicture  string `json:"profile_picture,omitempty"`
	PublishedTales []Tale `gorm:"foreignKey:UserID" json:"published_tales"`
	PurchasedTales []Tale `gorm:"many2many:tale_purchases" json:"purchased_tales"`
}

func NewUser(username,email,password string) *User {
	return &User{
		Username: username,
		Email: email,
		Password: password,
	}
}

