package repository

import (
	"context"
	"fmt"
	"toko-beras/backend/internal/model" // Sesuaikan dengan nama modul Anda

	"github.com/jackc/pgx"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ProductRepository struct {
	DB *pgxpool.Pool
}

func NewProductRepository(db *pgxpool.Pool) *ProductRepository {
	return &ProductRepository{DB: db}
}

// CreateProduct menambahkan produk baru ke database
func (r *ProductRepository) CreateProduct(product *model.Product) error {
	sql := `INSERT INTO products (name, description, category, price, stock, image_url)
	        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`
	
	err := r.DB.QueryRow(context.Background(), sql,
		product.Name, product.Description, product.Category, product.Price, product.Stock, product.ImageURL,
	).Scan(&product.ID, &product.CreatedAt)

	return err
}

// GetAllProducts mengambil semua produk dari database
func (r *ProductRepository) GetAllProducts() ([]model.Product, error) {
	var products []model.Product
	sql := `SELECT id, name, description, category, price, stock, image_url, created_at FROM products ORDER BY id DESC`

	rows, err := r.DB.Query(context.Background(), sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var p model.Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.Category, &p.Price, &p.Stock, &p.ImageURL, &p.CreatedAt); err != nil {
			return nil, err
		}
		products = append(products, p)
	}

	return products, nil
}

func (r *ProductRepository) GetProductByID(ctx context.Context, id int) (*model.Product, error) {
	var p model.Product
	sql := `SELECT id, name, description, category, price, stock, image_url, created_at FROM products WHERE id = $1`

	err := r.DB.QueryRow(ctx, sql, id).Scan(&p.ID, &p.Name, &p.Description, &p.Category, &p.Price, &p.Stock, &p.ImageURL, &p.CreatedAt)
	if err != nil {
		// INILAH PERBAIKANNYA: Cek secara spesifik jika errornya adalah "tidak ada baris"
		if err == pgx.ErrNoRows {
			// Kembalikan nil untuk produk dan nil untuk error, agar handler tahu ini bukan error server
			return nil, nil 
		}
		// Untuk error database lainnya, bungkus dan kembalikan
		return nil, fmt.Errorf("repository: gagal mengambil produk by id: %w", err)
	}

	return &p, nil
}

// DeleteProduct menghapus produk dari database berdasarkan ID
func (r *ProductRepository) DeleteProduct(ctx context.Context, id int) error {
	sql := `DELETE FROM products WHERE id = $1`

	// Exec digunakan karena kita tidak mengharapkan baris data kembali
	_, err := r.DB.Exec(ctx, sql, id)
	if err != nil {
		return fmt.Errorf("repository: gagal menghapus produk: %w", err)
	}

	return nil
}

// UpdateProduct memperbarui data produk di database
func (r *ProductRepository) UpdateProduct(ctx context.Context, product *model.Product) error {
    // Query ini sekarang juga mengupdate image_url
    sql := `UPDATE products 
            SET name = $1, description = $2, category = $3, price = $4, stock = $5, image_url = $6
            WHERE id = $7`

    _, err := r.DB.Exec(ctx, sql,
        product.Name, product.Description, product.Category, product.Price, product.Stock, product.ImageURL, product.ID,
    )

    if err != nil {
        return fmt.Errorf("repository: gagal memperbarui produk: %w", err)
    }
    return nil
} 

// Note: Fungsi untuk GetByID, Update, dan Delete bisa ditambahkan dengan pola yang sama.