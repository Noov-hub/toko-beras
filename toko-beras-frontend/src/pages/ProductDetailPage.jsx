import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetailPage.css';
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:8080';
// const API_URL = 'https://7h81qk4k-8080.asse.devtunnels.ms';

function ProductDetailPage() {
  const { id } = useParams(); // Ambil 'id' dari URL, misal: /produk/5
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // TAMBAHKAN /api/ di sini
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Gagal memuat data produk.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Jalankan efek ini setiap kali 'id' di URL berubah

  if (loading) return <p>Memuat...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!product) return <p>Produk tidak ditemukan.</p>;

  const handleAddToCart = () => {
    if (isAuthenticated) {
      addToCart(product);
    } else {
      alert('Anda harus login untuk menambahkan item ke keranjang.');
      // Sekarang 'navigate' sudah terdefinisi dan bisa digunakan
      navigate('/login');
    }
  };
  return (
    <div className="product-detail-container">
      <img src={`${API_URL}${product.image_url}`} alt={product.name} className="product-detail-image"/>
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        {/* ... info produk lainnya */}
        <p className="description">{product.description}</p>
        {/* 6. Panggil handleAddToCart saat tombol diklik */}
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
}

export default ProductDetailPage;