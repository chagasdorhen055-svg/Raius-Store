import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useStore } from '@/store';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/utils';

export default function SearchOverlay() {
  const navigate = useNavigate();
  const { isSearchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setSearchOpen]);

  const results = query.length > 0
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-raius-bg flex flex-col animate-in fade-in duration-200">
      {/* Header */}
      <div className="container-rai flex items-center justify-between h-16 md:h-20 border-b border-raius-glass-border">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="flex-1 bg-transparent text-xl md:text-2xl font-display text-raius-text placeholder:text-raius-text-tertiary outline-none border-none"
        />
        <button
          onClick={() => setSearchOpen(false)}
          className="text-raius-text-secondary hover:text-raius-text transition-colors ml-4"
        >
          <X size={24} strokeWidth={1.5} />
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="container-rai py-8">
          {query.length === 0 ? (
            <p className="text-sm text-raius-text-tertiary text-center">Start typing to search products</p>
          ) : results.length === 0 ? (
            <p className="text-sm text-raius-text-tertiary text-center">No results found for &quot;{query}&quot;</p>
          ) : (
            <div className="space-y-1">
              <p className="text-micro text-raius-text-tertiary mb-4">{results.length} RESULTS</p>
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    setSearchOpen(false);
                    navigate(`/product/${product.id}`);
                  }}
                  className="w-full flex items-center gap-4 p-3 hover:bg-raius-elevated transition-colors text-left"
                >
                  <div className="w-14 h-14 bg-raius-hover flex-shrink-0 overflow-hidden">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-raius-text truncate">{product.name}</p>
                    <p className="text-xs text-raius-text-tertiary">{product.category}</p>
                  </div>
                  <p className="text-sm text-raius-text">{formatPrice(product.price)}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
