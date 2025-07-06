import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Halaman dan Komponen
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar akan muncul di semua halaman */}
      <Navbar />

      <main>
        {/* Routes akan menentukan komponen mana yang ditampilkan berdasarkan URL */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/produk" element={<ProductListPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;