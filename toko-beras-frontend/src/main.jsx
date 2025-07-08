// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './context/CartContext'; // <-- 1. Import Provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider> {/* <-- 2. Bungkus App dengan CartProvider */}
      <App />
    </CartProvider>
  </StrictMode>,
)