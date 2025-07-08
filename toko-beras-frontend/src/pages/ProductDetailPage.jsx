import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetailPage.css';

const API_URL = 'http://localhost:8080';
// const API_URL = 'https://7h81qk4k-8080.asse.devtunnels.ms';

function ProductDetailPage() {
  const { id } = useParams(); // Ambil 'id' dari URL, misal: /produk/5
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
     console.log("Mencoba mengambil data untuk ID:", id); 
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

  return (
    <div className="product-detail-container">
      <img src={`${API_URL}${product.image_url}`} alt={product.name} className="product-detail-image"/>
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <p className="category">{product.category}</p>
        <p className="price">Rp {product.price.toLocaleString('id-ID')}</p>
        <p className="stock">Stok: {product.stock}</p>
        <p className="description">{product.description}</p>
        <button className="add-to-cart-btn">Tambah ke Keranjang</button>
      </div>
    </div>
  );
}

export default ProductDetailPage;