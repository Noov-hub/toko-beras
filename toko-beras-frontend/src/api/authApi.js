import axios from 'axios';

const API_URL = 'http://localhost:8080/auth';

export const registerUser = async (userData) => {
  // userData adalah objek berisi { name, email, password }
  return await axios.post(`${API_URL}/register`, userData);
};

export const loginUser = async (credentials) => {
  // credentials adalah objek berisi { email, password }
  const response = await axios.post(`${API_URL}/login`, credentials);
  // Jika login berhasil, simpan token ke Local Storage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};