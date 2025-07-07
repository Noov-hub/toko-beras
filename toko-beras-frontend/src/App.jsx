import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Halaman dan Komponen
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // <-- Tambahkan import ini
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/produk" element={<ProductListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> {/* <-- Tambahkan rute ini */}
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;