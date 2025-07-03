// internal/handler/order_handler.go
package handler

import (
	"net/http"
	"toko-beras/backend/internal/model"
	"toko-beras/backend/internal/repository"

	"github.com/gin-gonic/gin"
)

type OrderHandler struct {
	OrderRepo *repository.OrderRepository
}

func NewOrderHandler(orderRepo *repository.OrderRepository) *OrderHandler {
	return &OrderHandler{OrderRepo: orderRepo}
}

// CreateOrder: Handler untuk POST /orders
func (h *OrderHandler) CreateOrder(c *gin.Context) {
	var req struct {
		ShippingAddress string `json:"shipping_address" binding:"required"`
		Items           []struct {
			ProductID int     `json:"product_id" binding:"required"`
			Quantity  int     `json:"quantity" binding:"required"`
			Price     float64 `json:"price" binding:"required"`
		} `json:"items" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Ambil userID dari context yang sudah di-set oleh middleware
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Siapkan data order
	order := &model.Order{
		UserID:          userID.(int),
		Status:          "pending", // Status awal
		ShippingAddress: req.ShippingAddress,
	}

	var total float64
	for _, item := range req.Items {
		order.OrderItems = append(order.OrderItems, model.OrderItem{
			ProductID:       item.ProductID,
			Quantity:        item.Quantity,
			PriceAtPurchase: item.Price,
		})
		total += float64(item.Quantity) * item.Price
	}
	order.TotalAmount = total

	// Simpan ke database
	if err := h.OrderRepo.CreateOrder(order); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	c.JSON(http.StatusCreated, order)
}