import { createContext, useState, useContext } from 'react';

// 1. Buat Context
const CartContext = createContext();

// 2. Buat "Provider" (Penyedia State)
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    // Logika untuk menambah item ke keranjang
    // Kita akan membuatnya lebih pintar nanti (misal: cek jika item sudah ada)
    setCartItems(prevItems => [...prevItems, product]);
    alert(`${product.name} telah ditambahkan ke keranjang!`);
  };

  const value = {
    cartItems,
    addToCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// 3. Buat Custom Hook untuk mempermudah penggunaan
export function useCart() {
  return useContext(CartContext);
}