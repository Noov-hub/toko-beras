import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/orderApi'; // Akan kita buat nanti
import './CheckoutPage.css';

function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress) {
      setError('Alamat pengiriman wajib diisi.');
      return;
    }
    setLoading(true);

    const orderData = {
      shipping_address: shippingAddress,
      items: cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      await createOrder(orderData, token);
      alert('Pesanan Anda berhasil dibuat!');
      clearCart();
      navigate('/'); // Arahkan ke homepage setelah berhasil
    } catch (err) {
      setError('Gagal membuat pesanan. Silakan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <h2>Keranjang Anda kosong. Tidak ada yang bisa di-checkout.</h2>
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="order-summary">
        <h3>Ringkasan Pesanan</h3>
        {cartItems.map(item => (
          <div key={item.id} className="summary-item">
            <span>{item.name} (x{item.quantity})</span>
            <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
          </div>
        ))}
        <hr />
        <div className="summary-total">
          <strong>Total</strong>
          <strong>Rp {totalPrice.toLocaleString('id-ID')}</strong>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="shipping-form">
        <h3>Alamat Pengiriman</h3>
        <textarea
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Masukkan alamat lengkap Anda..."
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Memproses...' : 'Buat Pesanan'}
        </button>
      </form>
    </div>
  );
}

export default CheckoutPage;