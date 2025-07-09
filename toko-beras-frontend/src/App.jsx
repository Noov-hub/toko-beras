import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Halaman dan Komponen
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // <-- Tambahkan import ini
import Navbar from './components/Navbar';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboardPage from './pages/AdminDashboardPage'; // <-- Import halaman baru
import AdminRoute from './components/AdminRoute'; // <-- Import komponen proteksi

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/produk" element={<ProductListPage />} />
          <Route path="/produk/:id" element={<ProductDetailPage />} /> {/* <-- TAMBAHKAN INI */}
          <Route path="/keranjang" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

           {/* Rute Khusus Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            {/* Rute admin lainnya bisa ditambahkan di sini */}
          </Route>
          
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;