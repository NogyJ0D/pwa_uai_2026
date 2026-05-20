import { useState, useEffect } from 'react';
import type { ProductsResponse, Product } from '../types/product';
import ProductCard from '../components/ProductCard';

const ITEMS_PER_PAGE = 10;

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://dummyjson.com/products/category-list');
      const data: string[] = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async (offset: number, order: 'asc' | 'desc', category?: string) => {
    setLoading(true);
    try {
      let url = `https://dummyjson.com/products?limit=${ITEMS_PER_PAGE}&skip=${offset}&sortBy=price&order=${order}`;
      if (category) {
        url = `https://dummyjson.com/products/category/${category}?limit=${ITEMS_PER_PAGE}&skip=${offset}`;
      }
      const response = await fetch(url);
      const data: ProductsResponse = await response.json();
      setProducts(data.products);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(skip, sortOrder, selectedCategory || undefined);
  }, [skip, sortOrder, selectedCategory]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const currentPage = Math.floor(skip / ITEMS_PER_PAGE) + 1;

  const handlePageChange = (page: number) => {
    setSkip((page - 1) * ITEMS_PER_PAGE);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrder = e.target.value as 'asc' | 'desc';
    setSortOrder(newOrder);
    setSkip(0);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSkip(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-56 lg:w-64 flex-shrink-0">
            <button
              className="md:hidden w-full bg-white rounded shadow-sm p-3 flex justify-between items-center text-sm"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <span className="font-medium">Filtros</span>
              <svg className={`w-4 h-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div className={`${filtersOpen ? 'block' : 'hidden'} md:block bg-white rounded shadow-sm p-4`}>
              <h2 className="text-sm font-semibold mb-3">Filtros</h2>
              
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full border border-gray-300 rounded text-xs p-1.5"
                >
                  <option value="">Todas</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Precio
                </label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full border border-gray-300 rounded text-xs p-1"
                    disabled
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full border border-gray-300 rounded text-xs p-1"
                    disabled
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Marca
                </label>
                <select className="w-full border border-gray-300 rounded text-xs p-1.5" disabled>
                  <option>Seleccionar...</option>
                </select>
              </div>

              <button className="w-full bg-gray-800 text-white text-xs py-1.5 rounded hover:bg-gray-700 disabled:opacity-50" disabled>
                Aplicar
              </button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="bg-white rounded shadow-sm p-3 mb-3 flex flex-col sm:flex-row justify-between items-center gap-2">
              <span className="text-xs text-gray-600">
                {total} productos
              </span>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600">Ordenar:</label>
                <select
                  value={sortOrder}
                  onChange={handleSortChange}
                  className="border border-gray-300 rounded text-xs p-1"
                >
                  <option value="asc">Menor precio</option>
                  <option value="desc">Mayor precio</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Cargando productos...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-4 flex justify-center gap-1 flex-wrap">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 py-1 border border-gray-300 rounded text-xs disabled:opacity-50 hover:bg-gray-100"
                    >
                      ←
                    </button>
                    {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-2 py-1 border rounded text-xs ${
                          page === currentPage
                            ? 'bg-indigo-600 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 border border-gray-300 rounded text-xs disabled:opacity-50 hover:bg-gray-100"
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}