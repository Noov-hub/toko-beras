// cmd/api/main.go
package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	// Import package config yang baru kita buat
	"toko-beras/backend/config"
)

func main() {
	// Muat URL database dari file .env
	dbUrl := config.LoadConfig("DB_URL")
	if dbUrl == "" {
		log.Fatal("DB_URL is not found in .env file")
	}

	// Buat koneksi pool ke database PostgreSQL
	// pgxpool lebih direkomendasikan untuk aplikasi web karena mengelola koneksi secara efisien
	pool, err := pgxpool.New(context.Background(), dbUrl)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	// Tutup koneksi pool saat fungsi main selesai
	defer pool.Close()

	log.Println("Successfully connected to the database!")

	// Setup Gin router
	router := gin.Default()

	// Rute percobaan untuk memastikan server berjalan
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	// Jalankan server
	log.Println("Starting server on port 8080...")
	router.Run("localhost:8080")
}