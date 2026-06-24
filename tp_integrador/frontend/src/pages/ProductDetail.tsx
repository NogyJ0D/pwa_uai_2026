import { useState, useEffect, startTransition } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product } from '../types/product';
import { API_BASE_URL } from '../config/api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!id) {
      startTransition(() => {
        setError('ID de producto no válido');
        setLoading(false);
      });
      return;
    }

    startTransition(() => {
      setLoading(true);
      setError(null);
      setImgError(false);
    });

    let cancelled = false;
    const controller = new AbortController();

    fetch(`${API_BASE_URL}/productos/${id}`, { signal: controller.signal })
      .then(res => {
        if (cancelled) return null;
        if (!res.ok) {
          setProduct(null);
          return null;
        }
        return res.json() as Promise<Product>;
      })
      .then(data => {
        if (!cancelled && data) setProduct(data);
      })
      .catch((err) => {
        if (cancelled || (err instanceof DOMException && err.name === 'AbortError')) return;
        setError('Ocurrió un error al cargar el producto. Intente nuevamente.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; controller.abort(); };
  }, [id]);

  useEffect(() => {
    startTransition(() => setImgError(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-sm">{error}</p>
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
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              {product.image && !imgError ? (
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Sin imagen
                </div>
              )}
            </div>

            <div>
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mb-2">
                {product.category.name}
              </span>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">{product.name}</h1>

              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <span className="text-2xl sm:text-4xl font-bold text-indigo-600">
                  ${Number(product.price).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3 sm:mb-4 text-sm">
                <span className="text-yellow-500">★</span>
                <span className="font-medium">{product.rating}</span>
              </div>

              <div className="mb-3 sm:mb-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.stock > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `En stock (${product.stock} unidades)` : 'Sin stock'}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 sm:mb-6">
                {product.description ?? 'Sin descripción disponible.'}
              </p>

              <div className="border-t pt-3 sm:pt-4 space-y-1 sm:space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Marca:</span>
                  <span className="font-medium">{product.brand || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Categoría:</span>
                  <span className="font-medium">{product.category.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
