import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- 1. Import hook Auth
import { useCart } from '../context/CartContext';
import './Navbar.css'; // <-- 1. Import file CSS

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth(); // Ambil status login dan fungsi logout
  const { cartItems } = useCart(); // Ambil item keranjang untuk menghitung jumlahnya
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // <-- 2. State untuk menu mobile

  // console.log('User object from context:', user);
  const handleLogout = () => {
    // Tambahkan konfirmasi sebelum logout
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      logout();
      alert('Anda telah logout.');
      navigate('/');
    }
  };
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const NavLinks = ({ isMobile = false }) => (
    <>
      <Link to="/" className={isMobile ? "py-2" : ""} onClick={() => setIsMenuOpen(false)}>Home</Link>
      <Link to="/produk" className={isMobile ? "py-2" : ""} onClick={() => setIsMenuOpen(false)}>Produk</Link>
      {isAuthenticated ? (
        <>
          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" className={isMobile ? "py-2" : ""} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
          )}
          <Link to="/keranjang" className={`relative ${isMobile ? "py-2" : ""}`} onClick={() => setIsMenuOpen(false)}>
            Keranjang
            {totalCartItems > 0 && (
              <span className="absolute top-0 -right-4 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </Link>
          <button onClick={handleLogout} className={`font-medium text-red-400 hover:text-red-300 transition-colors bg-transparent border-none cursor-pointer ${isMobile ? "py-2" : ""}`}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className={isMobile ? "py-2" : ""} onClick={() => setIsMenuOpen(false)}>Login</Link>
          <Link to="/register" className={`text-white font-bold rounded-lg transition-colors ${isMobile ? "w-full text-center bg-green-600 py-2 mt-2" : "bg-green-600 hover:bg-green-700 py-2 px-4"}`} onClick={() => setIsMenuOpen(false)}>
            Register
          </Link>
        </>
      )}
    </>
  );
   return (
    <nav className="bg-gray-900 text-white shadow-lg px-4 sm:px-8 py-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-400 hover:text-green-300 transition-colors">
          Toko Beras
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-lg font-medium text-gray-300">
          <NavLinks />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Buka menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <div className="flex flex-col items-center space-y-2 text-lg text-gray-300">
            <NavLinks isMobile={true} />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;