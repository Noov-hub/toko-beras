import { Link } from 'react-router-dom';
import './Navbar.css'; // <-- 1. Import file CSS

function Navbar() {
  return (
    // 2. Terapkan class 'navbar' ke elemen nav
    <nav className="navbar"> 
      
      {/* 3. Tambahkan Logo (sebagai link ke Home) */}
      <Link to="/" className="navbar-logo">
        Toko Beras
      </Link>

      {/* 4. Kelompokkan link navigasi */}
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/produk">Produk</Link>
        <Link to="/login">Login</Link>
      </div>

    </nav>
  );
}

export default Navbar;