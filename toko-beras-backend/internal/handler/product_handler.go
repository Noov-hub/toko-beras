package handler

import (
	"fmt"
	"net/http"
	"strconv"
	"time"
	"toko-beras/backend/internal/model"      // Sesuaikan dengan nama modul Anda
	"toko-beras/backend/internal/repository" // Sesuaikan dengan nama modul Anda

	"github.com/gin-gonic/gin"
)

type ProductHandler struct {
	ProductRepo *repository.ProductRepository
}

func NewProductHandler(productRepo *repository.ProductRepository) *ProductHandler {
	return &ProductHandler{ProductRepo: productRepo}
}

// CreateProduct: Handler untuk POST /products
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	// 1. Baca setiap field dari form-data satu per satu
	name := c.PostForm("name")
	description := c.PostForm("description")
	category := c.PostForm("category")
	priceStr := c.PostForm("price")
	stockStr := c.PostForm("stock")

	// 2. Konversi string ke angka
	price, errPrice := strconv.ParseFloat(priceStr, 64)
	if errPrice != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid format for price"})
		return
	}
	stock, errStock := strconv.Atoi(stockStr)
	if errStock != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid format for stock"})
		return
	}

	// 3. Ambil file dari form-data
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image file is required"})
		return
	}

	// Buat nama file yang unik
	filename := fmt.Sprintf("%d-%s", time.Now().Unix(), file.Filename)
	filepath := fmt.Sprintf("./uploads/%s", filename)

	// 4. Simpan file yang di-upload
	if err := c.SaveUploadedFile(file, filepath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save file"})
		return
	}

	// 5. Buat struct Product dengan data yang sudah divalidasi
	product := &model.Product{
		Name:        name,
		Description: description,
		Category:    category,
		Price:       price,
		Stock:       stock,
		ImageURL:    "/uploads/" + filename,
	}

	// 6. Simpan ke database melalui repository
	if err := h.ProductRepo.CreateProduct(product); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	// 7. Kirim respons sukses
	c.JSON(http.StatusCreated, product)
}

// GetAllProducts: Handler untuk GET /products
func (h *ProductHandler) GetAllProducts(c *gin.Context) {
	products, err := h.ProductRepo.GetAllProducts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	c.JSON(http.StatusOK, products)
}

func (h *ProductHandler) GetProductByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	product, err := h.ProductRepo.GetProductByID(c.Request.Context(), id)
	if err != nil {
		// Error ini sekarang hanya akan terjadi jika ada masalah server/database, bukan karena tidak ditemukan
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch product"})
		return
	}

	// INILAH PERBAIKANNYA: Cek apakah produk yang dikembalikan adalah nil
	if product == nil {
		// Jika nil, berarti produk tidak ditemukan, kirim 404
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Jika produk ada, kirim 200 OK dengan data produk
	c.JSON(http.StatusOK, product)
}