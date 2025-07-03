package repository

import (
	"context"
	"toko-beras/backend/internal/model" // Sesuaikan dengan nama modul Anda

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
// Note: Fungsi untuk GetByID, Update, dan Delete bisa ditambahkan dengan pola yang sama.