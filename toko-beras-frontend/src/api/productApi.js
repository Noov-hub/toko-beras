import axios from 'axios';

const API_URL = 'http://localhost:8080';

// =======================================================
// BAGIAN PUBLIK (Tidak Perlu /api atau /admin)
// =======================================================

// Fungsi untuk mengambil semua produk (publik)
export const getAllProducts = async () => {
  // BENAR: Langsung ke /products
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

// Fungsi untuk mengambil detail produk (publik)
export const getProductById = async (productId) => {
  // BENAR: Langsung ke /products/:id
  const response = await axios.get(`${API_URL}/products/${productId}`);
  return response.data;
};


// =======================================================
// BAGIAN ADMIN (Menggunakan prefix /admin)
// =======================================================

// Fungsi untuk membuat produk baru (ADMIN)
export const createProduct = async (productData, token) => {
  // BENAR: Menggunakan /admin/products
  const response = await axios.post(`${API_URL}/admin/products`, productData, {
    headers: {
      // Biarkan Axios menangani Content-Type untuk FormData
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// Fungsi untuk mengupdate produk (ADMIN)
export const updateProduct = async (productId, productData, token) => {
  // BENAR: Menggunakan /admin/products/:id
  const response = await axios.put(`${API_URL}/admin/products/${productId}`, productData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// Fungsi untuk menghapus produk (ADMIN)
export const deleteProduct = async (productId, token) => {
  // BENAR: Menggunakan /admin/products/:id
  const response = await axios.delete(`${API_URL}/admin/products/${productId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};