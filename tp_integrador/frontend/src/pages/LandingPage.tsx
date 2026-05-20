import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
          Bienvenido a ShopEasy
        </h1>
        <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-lg mx-auto">
          Descubrí los mejores productos con los precios más competitivos del mercado.
        </p>
        <Link
          to="/catalog"
          className="inline-block bg-indigo-600 text-white text-base sm:text-lg font-semibold px-8 sm:px-10 py-3 sm:py-4 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
        >
          Ver Productos
        </Link>
      </div>
    </div>
  );
}