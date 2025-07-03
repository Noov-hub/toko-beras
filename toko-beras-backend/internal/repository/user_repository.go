package repository

import (
	"context"
	"toko-beras/backend/internal/model" // Sesuaikan dengan nama modul Anda

	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	DB *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) CreateUser(user *model.User) error {
	sql := `INSERT INTO users (name, email, password_hash, role) 
	        VALUES ($1, $2, $3, $4) RETURNING id, created_at`
	
	err := r.DB.QueryRow(context.Background(), sql, user.Name, user.Email, user.PasswordHash, "user").Scan(&user.ID, &user.CreatedAt)
	return err
}

func (r *UserRepository) GetUserByEmail(email string) (*model.User, error) {
	var user model.User
	sql := `SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = $1`

	err := r.DB.QueryRow(context.Background(), sql, email).Scan(&user.ID, &user.Name, &user.Email, &user.PasswordHash, &user.Role, &user.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &user, nil
}