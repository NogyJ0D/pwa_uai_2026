import { Link } from 'react-router-dom';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 sm:h-48 lg:h-52 overflow-hidden bg-gray-100">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
          {product.title}
        </h3>
        <p className="text-lg font-bold text-indigo-600 mb-2">
          ${product.price.toFixed(2)}
        </p>
        <Link
          to={`/product/${product.id}`}
          className="block w-full text-center bg-gray-800 text-white text-sm py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Ver Detalle
        </Link>
      </div>
    </div>
  );
}