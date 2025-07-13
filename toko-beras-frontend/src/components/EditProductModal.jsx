import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProduct } from '../api/productApi';
// import './AddProductModal.css'; // Kita pakai style yang sama

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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Edit Produk</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Nama Produk"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea 
            placeholder="Deskripsi"
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
          ></textarea>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="Beras premium">Beras Premium</option>
            <option value="Beras medium">Beras Medium</option>
            <option value="Beras submedium">Beras Submedium</option>
            <option value="Beras pecah">Beras Pecah</option>
          </select>
          <div className="flex gap-4">
            <input 
              type="number" 
              placeholder="Harga"
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              required 
              className="w-1/2 p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input 
              type="number" 
              placeholder="Stok"
              value={stock} 
              onChange={(e) => setStock(e.target.value)} 
              required 
              className="w-1/2 p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Gambar Saat Ini:</label>
            <img src={`http://localhost:8080${product.image_url}`} alt={product.name} className="max-h-40 w-auto rounded-md" />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-400">Ganti Gambar (Opsional):</label>
            <input 
              type="file" 
              onChange={(e) => setNewImage(e.target.files[0])} 
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-800 file:text-green-100 hover:file:bg-green-700"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? 'Memperbarui...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;