import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

const CATEGORIES = ['All', 'Hoodies', 'T-Shirts', 'Jackets', 'Pants', 'Accessories'];
const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Parse URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const filter = searchParams.get('filter');
    if (category) setActiveCategory(category.charAt(0).toUpperCase() + category.slice(1));
    if (filter === 'new') setActiveCategory('All');
    if (filter === 'bestsellers') setActiveCategory('All');
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (activeCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    // URL filter
    const filter = searchParams.get('filter');
    if (filter === 'new') filtered = filtered.filter((p) => p.isNew);
    if (filter === 'bestsellers') filtered = filtered.filter((p) => p.isBestseller);

    // Sort
    switch (sortBy) {
      case 'Price: Low to High':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'Newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return filtered;
  }, [activeCategory, sortBy, searchParams]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Entrance animation
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.children;
    gsap.from(cards, {
      y: 30,
      opacity: 0,
      stagger: 0.08,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, [activeCategory, sortBy]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(8);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat.toLowerCase());
    }
    setSearchParams(newParams);
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 8);
      setIsLoading(false);
    }, 600);
  };

  return (
    <main className="min-h-screen bg-raius-bg pt-20 md:pt-24">
      {/* Header */}
      <div className="container-rai py-8 md:py-12">
        <p className="text-micro text-raius-text-tertiary">
          <span className="hover:text-raius-text cursor-pointer">Home</span>
          <span className="mx-2">/</span>
          <span>Shop</span>
        </p>
        <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-raius-text mt-4">
          ALL PRODUCTS
        </h1>
      </div>

      {/* Filter Bar */}
      <div className="bg-raius-elevated">
        <div className="container-rai py-4 flex items-center justify-between gap-4">
          {/* Mobile: Filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 text-micro text-raius-text-secondary"
          >
            <SlidersHorizontal size={16} />
            FILTER
          </button>

          {/* Desktop: Category pills */}
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`text-micro px-4 py-1.5 border transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-raius-warm text-raius-bg border-raius-warm'
                    : 'border-raius-glass-border text-raius-text-secondary hover:text-raius-text hover:border-raius-text-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-transparent text-micro text-raius-text-secondary pr-6 pl-2 py-1.5 outline-none cursor-pointer border border-raius-glass-border"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-raius-elevated">{opt}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-raius-text-tertiary pointer-events-none" />
          </div>
        </div>

        {/* Mobile filters */}
        {showFilters && (
          <div className="md:hidden container-rai pb-4 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { handleCategoryChange(cat); setShowFilters(false); }}
                className={`text-micro px-4 py-1.5 border transition-all ${
                  activeCategory === cat
                    ? 'bg-raius-warm text-raius-bg border-raius-warm'
                    : 'border-raius-glass-border text-raius-text-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Count */}
      <div className="container-rai py-4">
        <p className="text-sm text-raius-text-tertiary">{filteredProducts.length} products</p>
      </div>

      {/* Product Grid */}
      <div className="container-rai pb-12">
        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Skeleton Loader */}
        {isLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-[skeleton-pulse_1.5s_ease-in-out_infinite]">
                <div className="aspect-[3/4] bg-raius-hover" />
                <div className="h-4 bg-raius-hover mt-3 w-3/4" />
                <div className="h-3 bg-raius-hover mt-2 w-1/4" />
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && !isLoading && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLoadMore}
              className="text-micro tracking-[0.1em] text-raius-text-secondary border border-raius-text-secondary px-10 py-3 hover:border-raius-text hover:text-raius-text transition-colors"
            >
              LOAD MORE
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
