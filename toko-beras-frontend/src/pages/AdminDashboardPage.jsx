import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllProducts, deleteProduct } from '../api/productApi'; 
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import './AdminDashboardPage.css'; // Kita akan buat file CSS ini

const API_URL = 'http://localhost:8080';
// const API_URL = 'https://7h81qk4k-8080.asse.devtunnels.ms';

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
    return <p>Memuat produk...</p>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Manajemen Produk</h1>
      <button onClick={() => setIsModalOpen(true)} className="add-product-btn">
        Tambah Produk Baru
      </button>

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

      {/* Tabel produk Anda */}
      <table className="products-table">
            <thead>
              <tr>
                <th>Gambar</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <img src={`http://localhost:8080${product.image_url}`} alt={product.name} className="product-thumbnail" />
                    {/* <img src={`http://localhost:8080${product.image_url}`} alt={product.name} className="product-thumbnail" /> */}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>Rp {product.price.toLocaleString('id-ID')}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button onClick={() => handleOpenEditModal(product)} className="edit-btn">Edit</button>
                    {/* Panggil handleDelete saat tombol diklik */}
                    <button onClick={() => handleDelete(product.id)} className="delete-btn">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    </div>
  );
}

export default AdminDashboardPage;