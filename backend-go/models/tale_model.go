package model

import (
	"time"

	"gorm.io/gorm"
)

type Tale struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Title string `gorm:"not null; size:50" json:"title" validate:"required"`
	Author string `gorm:"not null" json:"author" validate:"required"`
	Description string `gorm:"not null; size:1000" json:"description" validate:"required"`
	Preview string `gorm:"not null; size:1000" json:"preview" validate:"required"`
	Content string `gorm:"not null" json:"content" validate:"required"`
	Pages int64 `gorm:"not null" json:"pages" validate:"required"`
	Price float64 `gorm:"not null" json:"price" validate:"required"`
	IsActive bool `gorm:"type:boolean;not null;default:true" json:"is_active"`
	Genres []Genre `gorm:"many2many:tale_genres" json:"genres"`
    TaleImage  string `json:"tale_image,omitempty" validate:"required"`
	Rating float64	 `json:"rating" binding:"min=1,max=5"`
	PublishedAt time.Time `json:"published_at" validate:"required"`	
	UserID uint `gorm:"not null" json:"-" validate:"required"`
	TalePurchases []TalePurchase `gorm:"foreignKey:TaleID" json:"-"`
	TaleWishlisted []TaleWishlist `gorm:"foreignKey:TaleID" json:"-"`
}

type Genre struct {
	gorm.Model
	Name string `gorm:"not null" json:"name"`
}

type TaleGenre struct {
	TaleID uint
	GenreID uint
}

type TalePurchase struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
	DeletedAt      gorm.DeletedAt `gorm:"index"`
	TaleID         uint            `gorm:"not null" json:"-"`
	PurchaserUserID uint           `gorm:"not null" json:"-"`
	PurchaseDate   time.Time       `gorm:"not null" json:"purchase_date"`
	UserRating	   int 			   `json:"user_rating" binding:"min=1,max=5"`
}

type TaleWishlist struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt      time.Time
	TaleID         uint            `gorm:"not null" json:"-"`
	WishlistUserID uint           `gorm:"not null" json:"-"`
    TaleImage  string `json:"tale_image,omitempty" validate:"required"`
	Title string `gorm:"not null; size:50" json:"title" validate:"required"`
}


// Drafts

type Draft struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	Title string `gorm:"not null" json:"title"`
	Author string `gorm:"not null" json:"author"`
	Description string ` json:"description"`
	Preview string ` json:"preview"`
	Content string ` json:"content"`
	Pages int64 ` json:"pages"`
	Price float64 ` json:"price"`
	Genres []Genre `gorm:"many2many:draft_genres" json:"genres"`
    TaleImage  string `json:"tale_image,omitempty"`
	UserID uint `gorm:"not null" json:"-"`
}

type DraftGenre struct {
	DraftID uint
	GenreID uint
}