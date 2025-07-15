import { useState, useEffect } from 'react';
import axios from 'axios';
// import './ProductListPage.css';
import ProductCard from '../components/ProductCard';
// Definisikan URL API backend Anda
// const API_URL = 'http://localhost:8080';
const API_URL = 'https://7h81qk4k-8080.asse.devtunnels.ms';
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
        const response = await axios.get(`${API_URL}/products`);
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
  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <p className="text-xl text-gray-600">Memuat produk...</p>
    </div>
  );
  // Tampilkan pesan error jika terjadi kegagalan
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div 
      className="px-4 sm:px-8 py-8 bg-cover bg-center bg-fixed min-h-[90vh]"
      // Ganti dengan path gambar latar belakang yang Anda inginkan
      style={{ backgroundImage: "url('/images/sawah.jpg')" }}
    >
      <div className="text-center mb-12">
        {/* Menambahkan background pada judul agar mudah dibaca */}
        <h1 className="inline-block font-bold text-3xl md:text-4xl text-white bg-black/50 px-6 py-3 rounded-lg shadow-lg">
          Semua Produk Kami
        </h1>
      </div>
      {/* Grid yang lebih responsif */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {/* Kita akan petakan (map) data produk di sini */}
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </div>
  );
}

export default ProductListPage;