import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  // Cek localStorage saat aplikasi pertama kali dimuat
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // Nilai true jika ada token, false jika tidak ada

  const value = {
    token,
    isAuthenticated: !!token,
    loading, // <-- 3. Sediakan loading state ke komponen lain
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook untuk mempermudah penggunaan
export function useAuth() {
  return useContext(AuthContext);
}