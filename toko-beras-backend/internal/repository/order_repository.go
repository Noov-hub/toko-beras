// internal/repository/order_repository.go
package repository

import (
	"context"
	"toko-beras/backend/internal/model"

	"github.com/jackc/pgx/v5/pgxpool"
)

type OrderRepository struct {
	DB *pgxpool.Pool
}

func NewOrderRepository(db *pgxpool.Pool) *OrderRepository {
	return &OrderRepository{DB: db}
}

// CreateOrder membuat pesanan baru menggunakan transaksi database
func (r *OrderRepository) CreateOrder(order *model.Order) error {
	// Memulai transaksi
	tx, err := r.DB.Begin(context.Background())
	if err != nil {
		return err
	}
	// Defer a rollback in case of error
	defer tx.Rollback(context.Background())

	// 1. Masukkan ke tabel orders
	orderSQL := `INSERT INTO orders (user_id, total_amount, status, shipping_address)
	             VALUES ($1, $2, $3, $4) RETURNING id, created_at`
	err = tx.QueryRow(context.Background(), orderSQL, order.UserID, order.TotalAmount, order.Status, order.ShippingAddress).Scan(&order.ID, &order.CreatedAt)
	if err != nil {
		return err
	}

	// 2. Masukkan setiap item ke tabel order_items
	for _, item := range order.OrderItems {
		itemSQL := `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
		            VALUES ($1, $2, $3, $4)`
		_, err = tx.Exec(context.Background(), itemSQL, order.ID, item.ProductID, item.Quantity, item.PriceAtPurchase)
		if err != nil {
			return err
		}
	}

	// Jika semua berhasil, commit transaksi
	return tx.Commit(context.Background())
}