import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllProducts, deleteProduct } from '../api/productApi'; 
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
// import './AdminDashboardPage.css'; // Kita akan buat file CSS ini

// const API_URL = 'http://localhost:8080';
const API_URL = 'https://7h81qk4k-8080.asse.devtunnels.ms';

function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // <-- State untuk modal edit
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { token } = useAuth(); // Kita butuh token untuk aksi-aksi nanti

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts(); // <-- Panggil fungsi yang benar
        setProducts(data || []);
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  const handleProductAdded = (newProduct) => {
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDelete = async (productId) => {
    // Tampilkan konfirmasi sebelum menghapus
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await deleteProduct(productId, token);
        // Hapus produk dari state agar UI langsung terupdate
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
        alert('Produk berhasil dihapus.');
      } catch (error) {
        console.error("Gagal menghapus produk:", error);
        alert('Gagal menghapus produk.');
      }
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-xl text-gray-600">Memuat data produk...</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-[90vh] bg-cover bg-center bg-fixed p-4 sm:p-8"
      style={{ backgroundImage: "url('/images/sawah.jpg')" }}
    >
      <div className="max-w-7xl mx-auto bg-black/70 rounded-xl shadow-2xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Manajemen Produk</h1>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300"
          >
            + Tambah Produk
          </button>
        </div>

        {isModalOpen && (
          <AddProductModal 
            onClose={() => setIsModalOpen(false)}
            onProductAdded={handleProductAdded}
          />
        )}

        {isEditModalOpen && (
          <EditProductModal
            product={selectedProduct}
            onClose={() => setIsEditModalOpen(false)}
            onProductUpdated={handleProductUpdated}
          />
        )}

        <div className="overflow-x-auto bg-black/50 backdrop-blur-sm rounded-lg shadow-lg">
          <table className="w-full min-w-full divide-y divide-gray-700">
            <thead className="bg-black/40">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gambar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nama Produk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stok</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-white/10 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={`${API_URL}${product.image_url}`} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">Rp {product.price.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleOpenEditModal(product)} className="text-blue-400 hover:text-blue-300 mr-4 p-2 rounded-full hover:bg-white/10 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-white/10 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;