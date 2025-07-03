package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Fungsi untuk memuat nilai dari file .env
func LoadConfig(key string) string {
	// Muat file .env dari root direktori
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file")
	}
	return os.Getenv(key)
}