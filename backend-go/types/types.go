package types

import "time"

type UserType struct {
	Username        string `json:"username" binding:"required"`
	Email           string `json:"email" binding:"required,email"`
	Password        string `json:"password" binding:"required,min=8"`
	ConfirmPassword string `json:"confirm_password" binding:"required,min=8"`
}

type PasswordUpdate struct {
	CurrentPassword    string `json:"current_password"`
	NewPassword        string `json:"new_password"`
	ConfirmNewPassword string `json:"confirm_new_password"`
}

type LoginUserBody struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type TaleBody struct {
	Title       string         `json:"title" binding:"required"`
	Author      string         `json:"author" binding:"required"`
	Description string         `json:"description" binding:"required"`
	Preview     string         `json:"preview" binding:"required"`
	Content     string         `json:"content" binding:"required"`
	Pages       int64          `json:"pages" binding:"required"`
	Price       float64        `json:"price" binding:"required"`
	Genres      []string        `json:"genres" binding:"required"`
	PublishedAt time.Time      `json:"published_at" binding:"required"`
}

