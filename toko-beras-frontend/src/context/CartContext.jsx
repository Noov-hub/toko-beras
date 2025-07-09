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

  const addToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      // Cek apakah item sudah ada di keranjang
      const existingItem = prevItems.find((item) => item.id === productToAdd.id);

      if (existingItem) {
        // Jika sudah ada, update jumlahnya
        return prevItems.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Jika belum ada, tambahkan item baru dengan jumlah 1
      return [...prevItems, { ...productToAdd, quantity: 1 }];
    });
  };

  // --- PERUBAHAN 2: Tambah fungsi decreaseQuantity ---
  const decreaseQuantity = (productId) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productId);

      // Jika jumlahnya tinggal 1, hapus item dari keranjang
      if (existingItem.quantity === 1) {
        return prevItems.filter((item) => item.id !== productId);
      }

      // Jika lebih dari 1, kurangi jumlahnya
      return prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    // Juga hapus dari localStorage
    localStorage.removeItem('cartItems');
  };
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    clearCart, // Tambahkan ini
  };
  // const value = { cartItems, addToCart, removeFromCart, clearCart };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}