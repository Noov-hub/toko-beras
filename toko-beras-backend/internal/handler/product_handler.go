package handler

import (
	"net/http"
	"toko-beras/backend/internal/model" // Sesuaikan dengan nama modul Anda
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
	var product model.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.ProductRepo.CreateProduct(&product); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

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