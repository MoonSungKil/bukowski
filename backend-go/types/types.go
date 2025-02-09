package types

import (
	"time"

	model "github.com/moonsungkil/bukowski/models"
)

type UserType struct {
	Username        string `json:"username" binding:"required,min=3,max=15"`
	Email           string `json:"email" binding:"required,email"`
	Password        string `json:"password" binding:"required,min=8,max=16"`
	ConfirmPassword string `json:"confirm_password" binding:"required,min=8"`
	ProfilePicture 	string `json:"profile_picture"`
}

type PasswordUpdate struct {
	CurrentPassword    string `json:"current_password"`
	NewPassword        string `json:"new_password"`
	ConfirmNewPassword string `json:"confirm_new_password"`
}

type LoginUserBody struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type TaleBody struct {
	Title       string         `json:"title" binding:"required"`
	Author      string         `json:"author" binding:"required"`
	Description string         `json:"description" binding:"required"`
	Preview     string         `json:"preview" binding:"required"`
	Content     string         `json:"content" binding:"required"`
	Pages       int64          `json:"pages" binding:"required"`
	Price       float64        `json:"price" binding:"required"`
	IsActive 	bool			`json:"is_active" binding:"required"`
	Genres      []string        `json:"genres" binding:"required"`
	PublishedAt time.Time      `json:"published_at" binding:"required"`
}

type DraftBody struct {
	Title       string         `json:"title" binding:"required"`
	Author      string         `json:"author" binding:"required"`
	Description string         `json:"description" `
	Preview     string         `json:"preview" `
	Content     string         `json:"content" `
	Pages       int64          `json:"pages" `
	Price       float64        `json:"price" `
	Genres      []string        `json:"genres"`
}

type TaleBodyUnauthorized struct {
	ID          uint      `json:"id"`
	Title       string    `json:"title"`
	Author      string    `json:"author"`
	Description string    `json:"description"`
	Preview     string    `json:"preview"`
	Pages       int64     `json:"pages"`
	Price       float64   `json:"price"`
	IsActive    bool      `json:"is_active"`
	Genres      []model.Genre   `json:"genres"`
	TaleImage   string    `json:"tale_image"`
	PublishedAt time.Time `json:"published_at"`
}

type EmailRequest struct {
	Email string `json:"email" binding:"required,email"`
}