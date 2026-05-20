import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-3">
        <div className="flex justify-between items-center h-12">
          <button
            className="md:hidden p-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          <div className="hidden md:flex gap-6">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium text-sm">
              Inicio
            </Link>
            <Link to="/catalog" className="text-gray-600 hover:text-indigo-600 font-medium text-sm">
              Catálogo
            </Link>
          </div>

          <span className="text-base font-semibold text-gray-800">ShopEasy</span>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-3">
            <Link 
              to="/" 
              className="block py-2 text-gray-600 hover:text-indigo-600 text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              to="/catalog" 
              className="block py-2 text-gray-600 hover:text-indigo-600 text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Catálogo
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}