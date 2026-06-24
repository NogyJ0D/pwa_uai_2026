import { useState, useEffect, useCallback, startTransition } from 'react';
import type { ProductsResponse, Category } from '../types/product';
import { API_BASE_URL } from '../config/api';
import ProductFilters from '../components/ProductFilters';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 10;

export default function ProductCatalog() {
  const [products, setProducts] = useState<ProductsResponse['products']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [appliedCategory, setAppliedCategory] = useState('');
  const [appliedBrand, setAppliedBrand] = useState('');
  const [appliedPriceMin, setAppliedPriceMin] = useState('');
  const [appliedPriceMax, setAppliedPriceMax] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_BASE_URL}/categorias`, { signal: controller.signal })
      .then(res => res.json())
      .then((data: Category[]) => setCategories(data.map(c => c.name)))
      .catch(() => {});

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_BASE_URL}/marcas`, { signal: controller.signal })
      .then(res => res.json())
      .then((data: string[]) => setBrands(data))
      .catch(() => {});

    return () => controller.abort();
  }, []);

  const fetchProducts = useCallback(() => {
    let cancelled = false;

    startTransition(() => {
      setLoading(true);
      setError(null);
    });

    const controller = new AbortController();
    const params = new URLSearchParams({
      limit: String(ITEMS_PER_PAGE),
      page: String(page),
      sortBy: 'price',
      order: sortOrder,
    });

    if (appliedCategory) params.set('category', appliedCategory);
    if (appliedBrand) params.set('brand', appliedBrand);
    if (appliedPriceMin) params.set('priceMin', appliedPriceMin);
    if (appliedPriceMax) params.set('priceMax', appliedPriceMax);

    fetch(`${API_BASE_URL}/productos?${params}`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<ProductsResponse>;
      })
      .then(data => {
        if (!cancelled) {
          setProducts(data.products);
          setTotal(data.total);
        }
      })
      .catch((err) => {
        if (cancelled || (err instanceof DOMException && err.name === 'AbortError')) return;
        setError('Ocurrió un error al cargar los productos. Intente nuevamente.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; controller.abort(); };
  }, [page, sortOrder, appliedCategory, appliedBrand, appliedPriceMin, appliedPriceMax]);

  useEffect(() => {
    const cancel = fetchProducts();
    return () => cancel();
  }, [fetchProducts]);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const currentPage = page;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'asc' || value === 'desc') {
      setSortOrder(value);
      setPage(1);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
  };

  const handleApplyFilters = () => {
    setAppliedCategory(selectedCategory);
    setAppliedBrand(selectedBrand);
    setAppliedPriceMin(priceMin);
    setAppliedPriceMax(priceMax);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            brands={brands}
            selectedBrand={selectedBrand}
            priceMin={priceMin}
            priceMax={priceMax}
            filtersOpen={filtersOpen}
            onCategoryChange={handleCategoryChange}
            onBrandChange={handleBrandChange}
            onPriceMinChange={(e) => setPriceMin(e.target.value)}
            onPriceMaxChange={(e) => setPriceMax(e.target.value)}
            onApplyFilters={handleApplyFilters}
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
