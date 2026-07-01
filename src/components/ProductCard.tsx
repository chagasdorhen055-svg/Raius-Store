import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  showQuickAdd?: boolean;
  showNewBadge?: boolean;
}

export default function ProductCard({ product, showQuickAdd = true, showNewBadge = false }: ProductCardProps) {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist, addToCart } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      product,
      quantity: 1,
      color: product.colors[0]?.name || '',
      size: product.sizes[2] || product.sizes[0],
    });
  };

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-raius-hover overflow-hidden">
        {/* Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-[skeleton-pulse_1.5s_ease-in-out_infinite] bg-raius-hover" />
        )}

        {/* Main Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-[1.03]' : 'scale-100'}`}
        />

        {/* Hover Image */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {showNewBadge && product.isNew && (
            <span className="text-micro bg-raius-navy text-raius-text px-2.5 py-1">NEW</span>
          )}
          {product.originalPrice && (
            <span className="text-micro bg-raius-burgundy text-raius-text px-2.5 py-1">SALE</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-raius-bg/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Toggle wishlist"
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={inWishlist ? 'fill-raius-burgundy text-raius-burgundy' : 'text-raius-text'}
          />
        </button>

        {/* Quick Add */}
        {showQuickAdd && (
          <button
            onClick={handleQuickAdd}
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-micro bg-raius-bg text-raius-text px-5 py-2 border border-raius-glass-border whitespace-nowrap transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            QUICK ADD
          </button>
        )}
      </div>

      {/* Info */}
      <div className="mt-3">
        <h3 className="text-sm font-medium text-raius-text">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-raius-text">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-raius-text-tertiary line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
