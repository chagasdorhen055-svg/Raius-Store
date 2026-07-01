import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, Share2, Star, ChevronRight, Minus, Plus, Truck, RotateCcw, Package } from 'lucide-react';
import { gsap } from 'gsap';
import { getProductById, getRelatedProducts } from '@/data/products';
import { useStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';

const TABS = ['Description', 'Fabric & Care', 'Shipping & Returns'] as const;
type Tab = (typeof TABS)[number];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = getProductById(id || '');
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('Description');
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const ctaRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // Reset state when product changes
  useEffect(() => {
    setSelectedColor(0);
    setSelectedSize('');
    setQuantity(1);
    setActiveImage(0);
    setActiveTab('Description');
    setAddedToCart(false);
    window.scrollTo(0, 0);
  }, [id]);

  // Sticky CTA on mobile
  useEffect(() => {
    const handleScroll = () => {
      if (!ctaRef.current) return;
      const rect = ctaRef.current.getBoundingClientRect();
      setShowStickyCTA(rect.bottom < 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!infoRef.current) return;
    gsap.from(infoRef.current.children, {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out',
      delay: 0.2,
    });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-raius-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-raius-text-secondary">Product not found</p>
          <Link to="/shop" className="text-micro text-raius-warm mt-4 inline-block hover:underline">
            BACK TO SHOP
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const relatedProducts = getRelatedProducts(product.id);
  const selectedColorObj = product.colors[selectedColor];

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      product,
      quantity,
      color: selectedColorObj?.name || '',
      size: selectedSize,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) return;
    addToCart({
      product,
      quantity,
      color: selectedColorObj?.name || '',
      size: selectedSize,
    });
    navigate('/checkout');
  };

  return (
    <main className="min-h-screen bg-raius-bg pt-20 md:pt-24">
      {/* Breadcrumb */}
      <div className="container-rai py-4">
        <p className="text-micro text-raius-text-tertiary">
          <Link to="/shop" className="hover:text-raius-text">Shop</Link>
          <ChevronRight size={12} className="inline mx-1" />
          <span className="hover:text-raius-text">{product.category}</span>
          <ChevronRight size={12} className="inline mx-1" />
          <span>{product.name}</span>
        </p>
      </div>

      <div className="container-rai pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 lg:gap-12">
          {/* Gallery */}
          <div>
            {/* Main Image */}
            <div className="aspect-[4/5] bg-raius-hover overflow-hidden">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-20 md:w-20 md:h-24 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                      activeImage === i ? 'border-raius-warm' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div ref={infoRef}>
            <h1 className="font-display text-[clamp(1.5rem,3vw,2.5rem)] text-raius-text leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-3">
              <span className="text-xl font-semibold text-raius-text">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-base text-raius-text-tertiary line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating) ? 'fill-raius-warm text-raius-warm' : 'text-raius-text-tertiary'}
                  />
                ))}
              </div>
              <span className="text-micro text-raius-text-secondary tracking-normal">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            <p className="text-raius-text-secondary mt-5 leading-relaxed">{product.shortDescription}</p>

            {/* Color Selector */}
            <div className="mt-6">
              <p className="text-micro text-raius-text mb-3">COLOR: {selectedColorObj?.name}</p>
              <div className="flex gap-2">
                {product.colors.map((color, i) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(i)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === i ? 'border-raius-text scale-110' : 'border-raius-glass-border'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mt-6">
              <p className="text-micro text-raius-text mb-3">SIZE</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[56px] py-2.5 px-3 text-micro border transition-all ${
                      selectedSize === size
                        ? 'border-raius-text text-raius-text'
                        : 'border-raius-glass-border text-raius-text-secondary hover:border-raius-text-secondary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <p className="text-micro text-raius-text mb-3">QUANTITY</p>
              <div className="flex items-center border border-raius-glass-border w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-raius-text-secondary hover:text-raius-text"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm text-raius-text">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-raius-text-secondary hover:text-raius-text"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div ref={ctaRef} className="mt-8 space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`w-full py-4 text-micro tracking-[0.1em] transition-all ${
                  addedToCart
                    ? 'bg-green-700 text-white'
                    : 'bg-raius-warm text-raius-bg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {addedToCart ? 'ADDED TO BAG' : 'ADD TO BAG'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!selectedSize}
                className="w-full py-4 bg-transparent text-raius-warm border border-raius-warm text-micro tracking-[0.1em] hover:bg-raius-warm hover:text-raius-bg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                BUY IT NOW
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex items-center gap-6 mt-5">
              <button
                onClick={() => toggleWishlist(product.id)}
                className="flex items-center gap-2 text-micro text-raius-text-secondary hover:text-raius-text transition-colors"
              >
                <Heart size={16} strokeWidth={1.5} className={inWishlist ? 'fill-raius-burgundy text-raius-burgundy' : ''} />
                {inWishlist ? 'SAVED' : 'ADD TO WISHLIST'}
              </button>
              <button className="flex items-center gap-2 text-micro text-raius-text-secondary hover:text-raius-text transition-colors">
                <Share2 size={16} strokeWidth={1.5} />
                SHARE
              </button>
            </div>

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-raius-glass-border space-y-3">
              <div className="flex items-center gap-3 text-sm text-raius-text-secondary">
                <Truck size={16} strokeWidth={1.5} />
                Free shipping on orders over $150
              </div>
              <div className="flex items-center gap-3 text-sm text-raius-text-secondary">
                <RotateCcw size={16} strokeWidth={1.5} />
                30-day free returns
              </div>
              <div className="flex items-center gap-3 text-sm text-raius-text-secondary">
                <Package size={16} strokeWidth={1.5} />
                Premium packaging
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 pt-10 border-t border-raius-glass-border">
          <div className="flex gap-6 border-b border-raius-glass-border">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-micro transition-colors ${
                  activeTab === tab
                    ? 'text-raius-text border-b border-raius-text'
                    : 'text-raius-text-secondary hover:text-raius-text'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'Description' && (
              <div className="max-w-2xl">
                <p className="text-raius-text-secondary leading-relaxed">{product.description}</p>
                <p className="text-sm text-raius-text-secondary mt-4">{product.modelInfo}</p>
              </div>
            )}
            {activeTab === 'Fabric & Care' && (
              <div className="max-w-2xl">
                <p className="text-raius-text mb-3"><strong className="text-raius-text">Material:</strong> {product.fabric}</p>
                <ul className="space-y-2">
                  {product.care.map((item, i) => (
                    <li key={i} className="text-raius-text-secondary flex items-center gap-2">
                      <span className="w-1 h-1 bg-raius-warm rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'Shipping & Returns' && (
              <div className="max-w-2xl space-y-4">
                <p className="text-raius-text-secondary">Orders are processed within 1-2 business days. Standard shipping takes 3-5 business days. Express shipping available at checkout.</p>
                <p className="text-raius-text-secondary">We offer free returns within 30 days of delivery. Items must be unworn with original tags attached.</p>
                <p className="text-raius-text-secondary">Each order arrives in our signature premium packaging — designed to be kept and reused.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 pt-10 border-t border-raius-glass-border">
            <h2 className="font-display text-2xl md:text-3xl text-raius-text mb-8">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile CTA */}
      {showStickyCTA && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-raius-elevated/95 backdrop-blur-md border-t border-raius-glass-border p-4 md:hidden">
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className="w-full py-4 bg-raius-warm text-raius-bg text-micro tracking-[0.1em] disabled:opacity-50"
          >
            ADD TO BAG — {formatPrice(product.price * quantity)}
          </button>
        </div>
      )}
    </main>
  );
}
