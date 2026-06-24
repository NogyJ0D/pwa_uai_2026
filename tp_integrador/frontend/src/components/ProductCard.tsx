import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 sm:h-48 lg:h-52 overflow-hidden bg-gray-100">
        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Sin imagen
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-indigo-600 mb-2">
          ${Number(product.price).toFixed(2)}
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
