import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- 1. Import hook Auth
import { useCart } from '../context/CartContext';
import './Navbar.css'; // <-- 1. Import file CSS

function Navbar() {
  const { isAuthenticated, logout } = useAuth(); // Ambil status login dan fungsi logout
  const { cartItems } = useCart(); // Ambil item keranjang untuk menghitung jumlahnya
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert('Anda telah logout.');
    navigate('/'); // Arahkan ke Halaman Utama setelah logout
  };
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Toko Beras
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/produk">Produk</Link>
        {/* Tambahkan link ke keranjang */}
        <Link to="/keranjang">
          Keranjang ({cartItems.length}) {/* Tampilkan jumlah item */}
        </Link>
        {/* <Link to="/admin/dashboard">Admin Dashboard</Link> */}
        {/* Tampilkan link berdasarkan status login */}
        {isAuthenticated ? (
          <><button onClick={handleLogout} className="logout-btn">Logout</button><>
            <Link to="/admin/dashboard">Admin Dashboard</Link>
          </></>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;