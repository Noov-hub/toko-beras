import { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductListPage.css';
import ProductCard from '../components/ProductCard';
// Definisikan URL API backend Anda
const API_URL = 'http://localhost:8080';
// const API_URL = 'https://7h81qk4k-8080.asse.devtunnels.ms';
function ProductListPage() {
  // Siapkan state untuk menampung data produk dan status loading
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gunakan useEffect untuk mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Panggil endpoint publik untuk mendapatkan semua produk
        const response = await axios.get(`${API_URL}/api/products`);
        setProducts(response.data || []); // Simpan data ke state
      } catch (err) {
        setError('Gagal memuat data produk.');
        console.error(err);
      } finally {
        setLoading(false); // Hentikan status loading, baik berhasil maupun gagal
      }
    };

    fetchProducts();
  }, []); // Array kosong berarti efek ini hanya berjalan sekali

  // Tampilkan pesan loading saat data sedang diambil
  if (loading) return <p>Memuat produk...</p>;
  // Tampilkan pesan error jika terjadi kegagalan
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="product-page">
      <h1>Semua Produk Kami</h1>
      <div className="product-grid">
        {/* Kita akan petakan (map) data produk di sini */}
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </div>
  );
}

export default ProductListPage;