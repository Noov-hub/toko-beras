import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createProduct } from '../api/productApi';
import './AddProductModal.css';


function AddProductModal({ onClose, onProductAdded }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Beras premium'); // Nilai default
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('image', image);

    try {
      const newProduct = await createProduct(formData, token);
      onProductAdded(newProduct); // Kirim produk baru kembali ke halaman dashboard
      onClose(); // Tutup modal setelah berhasil
    } catch (err) {
      // --- PERUBAHAN DI SINI ---
      console.error("Error details from backend:", err.response); // Cetak seluruh respons error
      setError(err.response?.data?.message || 'Gagal menambahkan produk. Pastikan semua data terisi.');
      // -------------------------
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Tambah Produk Baru</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Nama Produk" value={name} onChange={(e) => setName(e.target.value)} required />
          <textarea placeholder="Deskripsi" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Beras premium">Beras Premium</option>
            <option value="Beras medium">Beras Medium</option>
            <option value="Beras submedium">Beras Submedium</option>
            <option value="Beras pecah">Beras Pecah</option>
          </select>
          <input type="number" placeholder="Harga" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <input type="number" placeholder="Stok" value={stock} onChange={(e) => setStock(e.target.value)} required />
          <label>Gambar Produk:</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} required />

          {error && <p className="error-message">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Batal</button>
            <button type="submit" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan Produk'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;