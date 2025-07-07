package middleware

import (
    "net/http"
    "strings"
    "toko-beras/backend/internal/auth" // Sesuaikan dengan nama modul Anda

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
            c.Abort()
            return
        }

        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        if tokenString == authHeader {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Bearer token required"})
            c.Abort()
            return
        }

        claims := &auth.Claims{}

        token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
            return []byte(auth.JwtKey), nil
        })

        if err != nil || !token.Valid {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }
        
        // Simpan informasi user di context agar bisa digunakan oleh handler selanjutnya
        c.Set("userID", claims.UserID)
        c.Set("userRole", claims.Role)

        c.Next()
    }
}

// AdminMiddleware memeriksa apakah peran pengguna adalah 'admin'
func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Ambil peran pengguna yang sudah disimpan oleh AuthMiddleware
		userRole, exists := c.Get("userRole")
		if !exists {
			// Ini seharusnya tidak terjadi jika AuthMiddleware berjalan dengan benar
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User role not found in token"})
			c.Abort()
			return
		}

		// Periksa apakah perannya adalah "admin"
		if userRole.(string) != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied: requires admin role"})
			c.Abort()
			return
		}

		// Jika admin, lanjutkan ke handler selanjutnya
		c.Next()
	}
}