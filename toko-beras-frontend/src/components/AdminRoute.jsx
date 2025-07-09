import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode'; // Kita perlu library baru ini

function AdminRoute() {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Memeriksa otentikasi...</div>;
  }
  // Jika tidak ada token, arahkan ke halaman login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    // "Bongkar" token untuk melihat isinya
    const decodedToken = jwtDecode(token);

    // Periksa apakah peran pengguna adalah 'admin'
    if (decodedToken.role !== 'admin') {
      // Jika bukan admin, arahkan ke halaman utama
      alert('Akses ditolak: Anda bukan admin.');
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    // Jika token tidak valid, arahkan ke login
    console.error("Invalid token:", error);
    return <Navigate to="/login" replace />;
  }

  // Jika token valid dan perannya adalah admin, tampilkan halaman yang diminta
  return <Outlet />;
}

export default AdminRoute;  