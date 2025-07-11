// cmd/api/main.go
package main

import (
	"context"
	"log"
	"net/http"
	"toko-beras/backend/config"
	"toko-beras/backend/internal/handler"
	"toko-beras/backend/internal/middleware"
	"toko-beras/backend/internal/repository"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	// ... (kode koneksi database dan inisialisasi lapisan tetap sama) ...
	dbUrl := config.LoadConfig("DB_URL")
	pool, err := pgxpool.New(context.Background(), dbUrl)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer pool.Close()
	log.Println("Successfully connected to the database!")

	userRepo := repository.NewUserRepository(pool)
	productRepo := repository.NewProductRepository(pool)
	orderRepo := repository.NewOrderRepository(pool)

	authHandler := handler.NewAuthHandler(userRepo)
	productHandler := handler.NewProductHandler(productRepo)
	orderHandler := handler.NewOrderHandler(orderRepo)
	
	router := gin.Default()
	config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://localhost:5173", "https://7h81qk4k-5173.asse.devtunnels.ms"}
    config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
    config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
    router.Use(cors.New(config))
    router.Static("/uploads", "./uploads")

	// --- RUTE PUBLIK ---
	router.GET("/products", productHandler.GetAllProducts)
    router.GET("/products/:id", productHandler.GetProductByID)
	// Semua rute di sini bisa diakses tanpa login
	// publicRoutes := router.Group("/api/public") // Menggunakan prefix baru untuk kejelasan
	// {
	// 	publicRoutes.GET("/products", productHandler.GetAllProducts)
	// 	publicRoutes.GET("/products/:id", productHandler.GetProductByID)
	// }

	// --- RUTE AUTENTIKASI ---
	authRoutes := router.Group("/auth")
	{
		authRoutes.POST("/register", authHandler.Register)
		authRoutes.POST("/login", authHandler.Login)
	}

	// --- RUTE PENGGUNA TEROTENTIKASI (Wajib Login) ---
	protectedRoutes := router.Group("/api")
	protectedRoutes.Use(middleware.AuthMiddleware())
	{
		protectedRoutes.POST("/orders", orderHandler.CreateOrder)
	}

	// --- RUTE KHUSUS ADMIN (Wajib Login & Peran Admin) ---
	adminRoutes := router.Group("/admin")
	adminRoutes.Use(middleware.AuthMiddleware())
	adminRoutes.Use(middleware.AdminMiddleware())
	{
		adminRoutes.POST("/products", productHandler.CreateProduct)
		adminRoutes.PUT("/products/:id", productHandler.UpdateProduct)
		adminRoutes.DELETE("/products/:id", productHandler.DeleteProduct)
	}
	
	// Rute Ping untuk tes
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})
	
	log.Println("Starting server on port 8080...")
	router.Run("localhost:8080")
}