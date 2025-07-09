import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProduct } from '../api/productApi';
import './AddProductModal.css'; // Kita pakai style yang sama

function EditProductModal({ product, onClose, onProductUpdated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  // Kita belum handle update gambar untuk saat ini
  // --- PERUBAHAN 1: State untuk gambar baru ---
  const [newImage, setNewImage] = useState(null); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // Isi form dengan data produk saat komponen pertama kali dimuat
  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setCategory(product.category);
      setPrice(product.price);
      setStock(product.stock);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

     // --- PERUBAHAN 2: Gunakan FormData untuk mengirim data ---
    // Ini diperlukan untuk bisa mengirim file gambar.
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('stock', stock);

    // Hanya tambahkan gambar ke form data jika pengguna memilih file baru.
    if (newImage) {
      formData.append('image', newImage);
    }

    try {
      // Kirim formData, bukan objek JSON
      const updated = await updateProduct(product.id, formData, token);
      onProductUpdated(updated);
      onClose();
    } catch (err) {
      setError('Gagal memperbarui produk.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Produk: {product?.name}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Beras premium">Beras Premium</option>
            <option value="Beras medium">Beras Medium</option>
            <option value="Beras submedium">Beras Submedium</option>
            <option value="Beras pecah">Beras Pecah</option>
          </select>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
          
          {/* --- PERUBAHAN 3: Tampilkan gambar saat ini dan input untuk gambar baru --- */}
          <div className="current-image-container">
            <label>Gambar Saat Ini:</label>
            <img src={`http://localhost:8080${product.image_url}`} alt={product.name} className="product-thumbnail-large" />
          </div>
          <label>Ganti Gambar (Opsional):</label>
          <input type="file" onChange={(e) => setNewImage(e.target.files[0])} />

          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Batal</button>
            <button type="submit" disabled={loading}>{loading ? 'Memperbarui...' : 'Simpan Perubahan'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;