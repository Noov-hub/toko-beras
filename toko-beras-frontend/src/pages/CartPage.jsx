import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
// import './CartPage.css';
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};
// const API_URL = 'http://localhost:8080';
const API_URL = 'https://7h81qk4k-8080.asse.devtunnels.ms';

function CartPage() {
  const { cartItems, removeFromCart, addToCart, decreaseQuantity } = useCart();


  // Hitung total harga
  // Hitung total harga dengan memperhitungkan kuantitas
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

 if (cartItems.length === 0) {
    return (
      <div 
        className="min-h-[90vh] bg-cover bg-center bg-fixed flex items-center justify-center p-4"
        style={{ backgroundImage: "url('/images/sawah.jpg')" }}
      >
        <div className="text-center bg-black/60 p-10 rounded-lg shadow-xl text-white">
          <h1 className="text-3xl font-bold mb-4">Keranjang Belanja Anda Kosong</h1>
          <p className="text-gray-300 mb-8">Sepertinya Anda belum menambahkan produk apapun.</p>
          <Link 
            to="/produk" 
            className="inline-block bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300"
          >
            Lihat Produk
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
      <div className="max-w-4xl mx-auto bg-black/70 rounded-xl shadow-2xl p-6 sm:p-8 text-white">
        <h1 className="text-3xl font-bold mb-8 text-center">Keranjang Belanja Anda</h1>
        
        <ul className="list-none p-0 space-y-4">
          {cartItems.map((item) => (
            <li key={item.id} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <img 
                src={item.imageUrl || `${API_URL}${item.image_url}`} 
                alt={item.name} 
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-grow">
                <h4 className="text-lg font-semibold">{item.name}</h4>
                <p className="text-green-400 font-medium">{formatRupiah(item.price)}</p>
                
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => decreaseQuantity(item.id)} className="w-7 h-7 bg-gray-600 rounded-full hover:bg-gray-500 transition">-</button>
                  <span className="font-bold text-lg">{item.quantity}</span>
                  <button onClick={() => addToCart(item)} className="w-7 h-7 bg-gray-600 rounded-full hover:bg-gray-500 transition">+</button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="self-center bg-transparent border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-6 border-t border-gray-600 text-right">
          <h2 className="text-2xl font-bold">Total: {formatRupiah(totalPrice)}</h2>
          <Link to="/checkout">
              <button className="mt-4 bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors duration-300">
                Lanjutkan ke Checkout
              </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;