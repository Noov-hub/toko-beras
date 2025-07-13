import { Link } from 'react-router-dom';
// import './ProductCard.css'; // Kita akan buat file CSS ini nanti
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};
const API_URL = 'http://localhost:8080';
// const API_URL = 'https://7h81qk4k-8080.asse.devtunnels.ms';
function ProductCard({ product }) {
  return (
    <Link to={`/produk/${product.id}`} className="block group">
      <div className="bg-black/60 border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 backdrop-blur-sm">
        <img 
          src={`${API_URL}${product.image_url}`} 
          alt={product.name} 
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-100 truncate group-hover:text-green-400 transition-colors">{product.name}</h3>
          <p className="text-gray-300 text-sm mt-1 h-10 overflow-hidden">{product.description}</p>
          <p className="text-lg font-bold text-green-500 mt-4">
            {formatRupiah(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;