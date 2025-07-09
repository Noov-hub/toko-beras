import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const createOrder = async (orderData, token) => {
  return await axios.post(`${API_URL}/orders`, orderData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};