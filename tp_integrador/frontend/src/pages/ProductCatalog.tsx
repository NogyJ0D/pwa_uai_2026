import { useState, useEffect, startTransition } from 'react';
import type { ProductsResponse, Product } from '../types/product';
import ProductFilters from '../components/ProductFilters';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 10;

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    fetch('https://dummyjson.com/products/category-list')
      .then(res => res.json())
      .then((data: string[]) => setCategories(data))
      .catch(() => setError('Error al cargar las categorías. Intente nuevamente.'));
  }, []);

  useEffect(() => {
    startTransition(() => {
      setLoading(true);
      setError(null);
    });

    let url = `https://dummyjson.com/products?limit=${ITEMS_PER_PAGE}&skip=${skip}&sortBy=price&order=${sortOrder}`;
    if (selectedCategory) {
      url = `https://dummyjson.com/products/category/${selectedCategory}?limit=${ITEMS_PER_PAGE}&skip=${skip}`;
    }

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<ProductsResponse>;
      })
      .then(data => {
        startTransition(() => {
          setProducts(data.products);
          setTotal(data.total);
        });
      })
      .catch(() => startTransition(() => setError('Ocurrió un error al cargar los productos. Intente nuevamente.')))
      .finally(() => startTransition(() => setLoading(false)));
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
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            filtersOpen={filtersOpen}
            onCategoryChange={handleCategoryChange}
            onToggleFilters={() => setFiltersOpen(!filtersOpen)}
          />

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

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded p-3 mb-3">
                {error}
              </div>
            )}

            <ProductGrid products={products} loading={loading} />

            {!loading && !error && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}