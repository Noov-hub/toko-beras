import { Link } from 'react-router-dom';
import './ProductCard.css'; // Kita akan buat file CSS ini nanti

const API_URL = 'http://localhost:8080';

function ProductCard({ product }) {
  return (
    // Bungkus seluruh kartu dengan komponen Link
    <Link to={`/produk/${product.id}`} className="product-card-link">
      <div className="product-card">
        <img src={`${API_URL}${product.image_url}`} alt={product.name} />
        <div className="product-card-info">
          <h3>{product.name}</h3>
          <p className="price">Rp {product.price.toLocaleString('id-ID')}</p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;