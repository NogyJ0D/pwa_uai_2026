import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product } from '../types/product';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        const data: Product = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Cargando...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Producto no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-5xl mx-auto px-3 sm:px-4">
        <Link
          to="/catalog"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm mb-4"
        >
          ← Volver
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            <div>
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3 sm:mb-4">
                <img
                  src={product.images[selectedImage] || product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                        idx === selectedImage ? 'border-indigo-600' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mb-2">
                {product.category}
              </span>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">{product.title}</h1>
              
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <span className="text-2xl sm:text-4xl font-bold text-indigo-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-sm sm:text-lg text-gray-500 line-through">
                    ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3 sm:mb-4 text-sm">
                <span className="text-yellow-500">★</span>
                <span className="font-medium">{product.rating}</span>
                <span className="text-gray-500">({product.reviews.length} reseñas)</span>
              </div>

              <div className="mb-3 sm:mb-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.availabilityStatus === 'Low Stock'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {product.availabilityStatus} ({product.stock} unidades)
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 sm:mb-6">{product.description}</p>

              <div className="border-t pt-3 sm:pt-4 space-y-1 sm:space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Marca:</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">SKU:</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Garantía:</span>
                  <span className="font-medium text-xs">{product.warrantyInformation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Envío:</span>
                  <span className="font-medium text-xs">{product.shippingInformation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Devolución:</span>
                  <span className="font-medium text-xs">{product.returnPolicy}</span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 flex gap-3 sm:gap-4">
                <button className="flex-1 bg-indigo-600 text-white py-2 sm:py-3 rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                  Agregar al Carrito
                </button>
                <button className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-100">
                  ♥
                </button>
              </div>
            </div>
          </div>

          {product.reviews.length > 0 && (
            <div className="mt-8 sm:mt-12 border-t pt-6 sm:pt-8">
              <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">Reseñas</h2>
              <div className="space-y-3 sm:space-y-4">
                {product.reviews.map((review, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">{review.reviewerName}</span>
                      <span className="text-yellow-500 text-sm">{'★'.repeat(review.rating)}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}