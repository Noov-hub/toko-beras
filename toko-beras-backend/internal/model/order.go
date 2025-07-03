// internal/model/order.go
package model

import "time"

type Order struct {
	ID               int         `json:"id"`
	UserID           int         `json:"user_id"`
	TotalAmount      float64     `json:"total_amount"`
	Status           string      `json:"status"`
	ShippingAddress  string      `json:"shipping_address"`
	CreatedAt        time.Time   `json:"created_at"`
	OrderItems       []OrderItem `json:"order_items"` // Untuk menampung detail item
}

type OrderItem struct {
	ID                int     `json:"id"`
	OrderID           int     `json:"order_id"`
	ProductID         int     `json:"product_id"`
	Quantity          int     `json:"quantity"`
	PriceAtPurchase   float64 `json:"price_at_purchase"`
}