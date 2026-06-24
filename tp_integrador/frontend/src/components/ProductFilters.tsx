interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  brands: string[];
  selectedBrand: string;
  priceMin: string;
  priceMax: string;
  filtersOpen: boolean;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBrandChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPriceMinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceMaxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyFilters: () => void;
  onToggleFilters: () => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  brands,
  selectedBrand,
  priceMin,
  priceMax,
  filtersOpen,
  onCategoryChange,
  onBrandChange,
  onPriceMinChange,
  onPriceMaxChange,
  onApplyFilters,
  onToggleFilters,
}: ProductFiltersProps) {
  return (
    <aside className="md:w-56 lg:w-64 flex-shrink-0">
      <button
        className="md:hidden w-full bg-white rounded shadow-sm p-3 flex justify-between items-center text-sm"
        onClick={onToggleFilters}
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
            onChange={onCategoryChange}
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
              value={priceMin}
              onChange={onPriceMinChange}
              className="w-full border border-gray-300 rounded text-xs p-1"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={onPriceMaxChange}
              className="w-full border border-gray-300 rounded text-xs p-1"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Marca
          </label>
          <select
            value={selectedBrand}
            onChange={onBrandChange}
            className="w-full border border-gray-300 rounded text-xs p-1.5"
          >
            <option value="">Todas</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onApplyFilters}
          className="w-full bg-gray-800 text-white text-xs py-1.5 rounded hover:bg-gray-700"
        >
          Aplicar
        </button>
      </div>
    </aside>
  );
}
