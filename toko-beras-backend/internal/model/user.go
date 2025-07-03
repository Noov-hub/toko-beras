package model

import "time"

type User struct {
	ID           int       `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // Tanda '-' berarti jangan pernah kirim field ini dalam respons JSON
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
}