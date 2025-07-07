package main

import (
	"context"
	"log"
	"net/http"
	"toko-beras/backend/config"
	"toko-beras/backend/internal/handler"
	"toko-beras/backend/internal/middleware" // Import middleware
	"toko-beras/backend/internal/repository"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	// ... (kode koneksi database tetap sama)
	dbUrl := config.LoadConfig("DB_URL")
	pool, err := pgxpool.New(context.Background(), dbUrl)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer pool.Close()
	log.Println("Successfully connected to the database!")

	// Inisialisasi semua lapisan aplikasi
	userRepo := repository.NewUserRepository(pool)
	productRepo := repository.NewProductRepository(pool) // <-- Tambahkan ini
	orderRepo := repository.NewOrderRepository(pool)

	authHandler := handler.NewAuthHandler(userRepo)
	productHandler := handler.NewProductHandler(productRepo) // <-- Tambahkan ini
	orderHandler := handler.NewOrderHandler(orderRepo)

	// Setup Gin router
	router := gin.Default()
	router.Use(cors.Default())

	// Ini memberitahu Gin: "Jika ada permintaan ke URL yang diawali dengan /uploads,
    // cari filenya di dalam direktori fisik ./uploads di server."
    router.Static("/uploads", "./uploads")

	// Grup rute untuk Autentikasi (Publik)
	authRoutes := router.Group("/auth")
	{
		authRoutes.POST("/register", authHandler.Register)
		authRoutes.POST("/login", authHandler.Login)
	}

	// Grup rute untuk API utama (Terproteksi)
	apiRoutes := router.Group("/api")

	apiRoutes.GET("/products", productHandler.GetAllProducts)
	apiRoutes.Use(middleware.AuthMiddleware())
	{
		// Rute untuk Order
		apiRoutes.POST("/orders", orderHandler.CreateOrder)
	}

	// Grup rute untuk Admin (Terproteksi)
	adminRoutes := router.Group("/admin")
	adminRoutes.Use(middleware.AuthMiddleware()) // Penjaga 1: Cek dulu apakah login & token valid
	adminRoutes.Use(middleware.AdminMiddleware())  // Penjaga 2: LALU, cek apakah dia admin
	{
		// Hanya admin yang bisa mengakses rute-rute ini
		adminRoutes.POST("/products", productHandler.CreateProduct)
	}

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	log.Println("Starting server on port 8080...")
	router.Run("localhost:8080")
}