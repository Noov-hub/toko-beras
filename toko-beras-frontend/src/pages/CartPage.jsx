import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const API_URL = 'http://localhost:8080';
// const API_URL = 'https://7h81qk4k-8080.asse.devtunnels.ms';

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
      <div className="cart-container">
        <h1>Keranjang Belanja Anda</h1>
        <p>Keranjang Anda masih kosong.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Keranjang Belanja Anda</h1>
      <ul className="cart-items">
        {cartItems.map((item) => (
          // Gunakan item.id sebagai key karena sekarang unik
          <li key={item.id} className="cart-item">
            <img src={`${API_URL}${item.image_url}`} alt={item.name} />
            <div className="item-info">
              <h4>{item.name}</h4>
              <p>Rp {item.price.toLocaleString('id-ID')}</p>
              
              {/* --- Tombol Kuantitas --- */}
              <div className="quantity-controls">
                <button onClick={() => decreaseQuantity(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => addToCart(item)}>+</button>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="remove-btn"
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <h2>Total: Rp {totalPrice.toLocaleString('id-ID')}</h2>
        <Link to="/checkout">
            <button className="checkout-btn">Lanjutkan ke Checkout</button>
        </Link>
      </div>
    </div>
  );
}

export default CartPage;