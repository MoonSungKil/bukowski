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
	Title string `gorm:"not null" json:"title"`
	Author string `gorm:"not null" json:"author"`
	Description string `gorm:"not null" json:"description"`
	Preview string `gorm:"not null" json:"preview"`
	Content string `gorm:"not null" json:"content"`
	Pages int64 `gorm:"not null" json:"pages"`
	Price float64 `gorm:"not null" json:"price"`
	Status string `gorm:"type:varchar(9);not null;default:'draft'" json:"status"`
	Genres []Genre `gorm:"many2many:tale_genres" json:"genres"`
	PublishedAt time.Time `json:"published_at"`	
	UserID uint `gorm:"not null" json:"-"`
	TalePurchases []TalePurchase `gorm:"foreignKey:TaleID" json:"-"`
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
}
