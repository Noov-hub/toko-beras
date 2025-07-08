import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const API_URL = 'http://localhost:8080';

function CartPage() {
  const { cartItems, removeFromCart } = useCart();

  // Hitung total harga
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

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
        {cartItems.map((item, index) => (
          <li key={`${item.id}-${index}`} className="cart-item">
            <img src={`${API_URL}${item.image_url}`} alt={item.name} />
            <div className="item-info">
              <h4>{item.name}</h4>
              <p>Rp {item.price.toLocaleString('id-ID')}</p>
            </div>
              <button
              onClick={() => removeFromCart(item.id)}
              className="remove-btn"
            >
              Hapus
            </button>
            {/* Nanti kita bisa tambahkan tombol untuk ubah jumlah atau hapus */}
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