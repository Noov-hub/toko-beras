import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/orderApi'; // Akan kita buat nanti
// import './CheckoutPage.css';

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

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
    return (
      <div 
        className="min-h-[90vh] bg-cover bg-center bg-fixed flex items-center justify-center p-4"
        style={{ backgroundImage: "url('/images/sawah.jpg')" }}
      >
        <div className="text-center bg-black/60 p-10 rounded-lg shadow-xl text-white">
          <h1 className="text-3xl font-bold mb-4">Keranjang Anda Kosong</h1>
          <p className="text-gray-300 mb-8">Tidak ada yang bisa di-checkout.</p>
          <Link 
            to="/produk" 
            className="inline-block bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300"
          >
            Kembali Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-[90vh] bg-cover bg-center bg-fixed p-4 sm:p-8"
      style={{ backgroundImage: "url('/images/sawah.jpg')" }}
    >
      <div className="max-w-2xl mx-auto bg-black/70 rounded-xl shadow-2xl p-6 sm:p-8 text-white">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        
        {/* Ringkasan Pesanan */}
        <div className="border border-gray-600 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4">Ringkasan Pesanan</h3>
          <div className="space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center text-gray-300">
                <span>{item.name} (x{item.quantity})</span>
                <span>{formatRupiah(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <hr className="border-gray-500 my-4" />
          <div className="flex justify-between text-lg font-bold mt-4">
            <strong>Total</strong>
            <strong>{formatRupiah(totalPrice)}</strong>
          </div>
        </div>

        {/* Form Alamat Pengiriman */}
        <form onSubmit={handlePlaceOrder}>
          <h3 className="text-2xl font-bold mb-4">Alamat Pengiriman</h3>
          <textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Masukkan alamat lengkap Anda, termasuk nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, dan kode pos."
            required
            className="w-full min-h-[120px] p-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : 'Buat Pesanan'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;