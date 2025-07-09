package handler

import (
	"fmt"
	"log"
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

// CreateProduct: Handler untuk POST /admin/products (VERSI BARU DENGAN DEBUGGING)
func (h *ProductHandler) CreateProduct(c *gin.Context) {
    // 1. Baca setiap field dari form-data
    name := c.PostForm("name")
    description := c.PostForm("description")
    category := c.PostForm("category")
    priceStr := c.PostForm("price")
    stockStr := c.PostForm("stock")

    // --- BLOK DEBUGGING: Cetak nilai yang diterima ke terminal ---
    log.Printf("Menerima data form: name=%s, price=%s, stock=%s", name, priceStr, stockStr)
    // -----------------------------------------------------------

    // 2. Konversi string ke angka dengan pesan error yang lebih jelas
    price, errPrice := strconv.ParseFloat(priceStr, 64)
    if errPrice != nil {
        // Beri tahu persis mana yang salah
        c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid format for price: %s", priceStr)})
        return
    }
    stock, errStock := strconv.Atoi(stockStr)
    if errStock != nil {
        // Beri tahu persis mana yang salah
        c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid format for stock: %s", stockStr)})
        return
    }

    // 3. Ambil file dari form-data
    file, err := c.FormFile("image")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Image file is required"})
        return
    }

    // ... (Sisa kode untuk menyimpan file dan data tetap sama)
    filename := fmt.Sprintf("%d-%s", time.Now().Unix(), file.Filename)
    filepath := fmt.Sprintf("./uploads/%s", filename)

    if err := c.SaveUploadedFile(file, filepath); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save file"})
        return
    }

    product := &model.Product{
        Name:        name,
        Description: description,
        Category:    category,
        Price:       price,
        Stock:       stock,
        ImageURL:    "/uploads/" + filename,
    }

    if err := h.ProductRepo.CreateProduct(product); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product in database"})
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


// DeleteProduct: Handler untuk DELETE /admin/products/:id
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	err = h.ProductRepo.DeleteProduct(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

// UpdateProduct: Handler untuk PUT /admin/products/:id
// UpdateProduct: Handler untuk PUT /admin/products/:id (VERSI BARU)
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
    // 1. Ambil ID dari URL
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
        return
    }

    // 2. Ambil produk yang ada dari database untuk mendapatkan URL gambar lama
    existingProduct, err := h.ProductRepo.GetProductByID(c.Request.Context(), id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch existing product"})
        return
    }
    if existingProduct == nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Product to update not found"})
        return
    }

    // 3. Baca data dari form (bukan JSON)
    price, err := strconv.ParseFloat(c.PostForm("price"), 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid format for price"})
        return
    }
    stock, err := strconv.Atoi(c.PostForm("stock"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid format for stock"})
        return
    }

    // Buat objek produk dengan data baru
    product := &model.Product{
        ID:          id,
        Name:        c.PostForm("name"),
        Description: c.PostForm("description"),
        Category:    c.PostForm("category"),
        Price:       price,
        Stock:       stock,
        ImageURL:    existingProduct.ImageURL, // Default ke gambar lama
    }

    // 4. Cek apakah ada file gambar baru yang di-upload
    file, err := c.FormFile("image")
    if err == nil { // Jika tidak ada error, berarti ada file baru
        // Hapus file gambar lama jika perlu (opsional, tapi praktik yang baik)
        // os.Remove("." + existingProduct.ImageURL)

        // Simpan file baru
        filename := fmt.Sprintf("%d-%s", time.Now().Unix(), file.Filename)
        filepath := fmt.Sprintf("./uploads/%s", filename)
        if err := c.SaveUploadedFile(file, filepath); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save new file"})
            return
        }
        // Update URL gambar di objek produk
        product.ImageURL = "/uploads/" + filename
    }

    // 5. Panggil repository untuk update data di database
    if err := h.ProductRepo.UpdateProduct(c.Request.Context(), product); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product in database"})
        return
    }

    c.JSON(http.StatusOK, product)
}