import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './ProductDetailPage.css';
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext';

// const API_URL = 'http://localhost:8080';
const API_URL = 'https://7h81qk4k-8080.asse.devtunnels.ms';

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

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
        const response = await axios.get(`${API_URL}/products/${id}`);
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

  if (loading) return (
    <div className="flex justify-center items-center h-[80vh]">
      <p className="text-xl text-gray-600">Memuat produk...</p>
    </div>
  );
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!product) return <p className="text-center text-gray-600 mt-10">Produk tidak ditemukan.</p>;

  const handleAddToCart = () => {
    if (isAuthenticated) {
      addToCart(product);
      alert(`${product.name} telah ditambahkan ke keranjang!`);
    } else {
      alert('Anda harus login untuk menambahkan item ke keranjang.');
      navigate('/login');
    }
  };

  return (
    <div 
      className="min-h-[90vh] bg-cover bg-center bg-fixed p-4 sm:p-8 flex items-center justify-center"
      style={{ backgroundImage: "url('/images/sawah.jpg')" }}
    >
      <div className="max-w-4xl w-full mx-auto bg-black/70 rounded-xl shadow-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row gap-8">
        <div className="md:w-2/5">
          <img 
            src={`${API_URL}${product.image_url}`} 
            alt={product.name} 
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-3/5 flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{product.name}</h1>
          <p className="text-lg text-gray-400 mt-2">Kategori: {product.category}</p>
          <p className="text-3xl font-bold text-green-400 my-4">
            {formatRupiah(product.price)}
          </p>
          <p className="text-gray-300 leading-relaxed flex-grow">{product.description}</p>
          <p className="text-gray-400 mt-4">Stok tersedia: {product.stock}</p>
          <button 
            onClick={handleAddToCart}
            className="w-full mt-6 bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:bg-gray-500"
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;