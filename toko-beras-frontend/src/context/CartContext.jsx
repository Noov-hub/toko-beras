import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

// Fungsi untuk mengambil data awal dari localStorage
const getInitialCart = () => {
  const savedCart = localStorage.getItem('cartItems');
  return savedCart ? JSON.parse(savedCart) : [];
};

export function CartProvider({ children }) {
  // Gunakan data dari localStorage sebagai nilai awal state
  const [cartItems, setCartItems] = useState(getInitialCart);

  // Gunakan useEffect untuk menyimpan ke localStorage setiap kali cartItems berubah
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const exist = prevItems.find(item => item.id === product.id);
      if (exist) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    alert(`${product.name} telah ditambahkan ke keranjang!`);
  };


  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      // Buat array baru yang berisi semua item KECUALI yang ID-nya cocok
      return prevItems.filter(item => item.id !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    // Juga hapus dari localStorage
    localStorage.removeItem('cartItems');
  };

  const value = { cartItems, addToCart, removeFromCart, clearCart };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}