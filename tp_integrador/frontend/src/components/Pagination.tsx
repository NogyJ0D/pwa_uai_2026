interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex justify-center gap-1 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 border border-gray-300 rounded text-xs disabled:opacity-50 hover:bg-gray-100"
      >
        ←
      </button>
      {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
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
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 border border-gray-300 rounded text-xs disabled:opacity-50 hover:bg-gray-100"
      >
        →
      </button>
    </div>
  );
}
