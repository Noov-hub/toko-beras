import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // <-- 1. Import pustaka yang baru diinstal

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // --- PERUBAHAN 2: Tambahkan state untuk user ---
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- PERUBAHAN 3: Logika untuk mendekode token ---
  useEffect(() => {
    try {
      if (token) {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser); // Simpan data user dari token ke state
      } else {
        setUser(null); // Jika tidak ada token, pastikan user null
      }
    } catch (error) {
      console.error("Token tidak valid, logout...", error);
      setUser(null); // Hapus user jika token rusak
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [token]); // Efek ini akan berjalan setiap kali token berubah

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken); // Mengatur token akan memicu useEffect di atas
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null); // Menghapus token akan memicu useEffect di atas
  };

  // --- PERUBAHAN 4: Tambahkan 'user' ke dalam value ---
  const value = {
    token,
    user, // Sediakan data user ke komponen lain
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook untuk mempermudah penggunaan
export function useAuth() {
  return useContext(AuthContext);
}
