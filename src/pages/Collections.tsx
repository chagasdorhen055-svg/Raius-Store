import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { collections, getProductsByCollection } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function Collections() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // If no slug, show collections list
  if (!slug) {
    return (
      <main className="min-h-screen bg-raius-bg pt-20 md:pt-24">
        <div className="container-rai py-8 md:py-12">
          <p className="text-micro text-raius-text-tertiary">
            <Link to="/" className="hover:text-raius-text">Home</Link>
            <span className="mx-2">/</span>
            <span>Collections</span>
          </p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-raius-text mt-4">COLLECTIONS</h1>
        </div>

        <div className="container-rai pb-16 space-y-8">
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => navigate(`/collections/${collection.slug}`)}
              className="w-full relative aspect-[16/7] md:aspect-[16/5] overflow-hidden group text-left"
            >
              <img
                src={collection.image}
                alt={collection.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <span className="text-micro tracking-[0.3em] text-raius-warm">{collection.title}</span>
                <h2 className="font-display text-3xl md:text-5xl text-raius-text mt-3">{collection.name}</h2>
                <p className="text-raius-text-secondary mt-2 max-w-md text-center">{collection.subtitle}</p>
                <span className="text-micro text-raius-warm mt-4 flex items-center gap-2 group-hover:underline">
                  EXPLORE <ArrowRight size={14} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>
    );
  }

  // Show specific collection
  const collection = collections.find((c) => c.slug === slug);
  const collectionProducts = getProductsByCollection(slug);

  if (!collection) {
    return (
      <div className="min-h-screen bg-raius-bg flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-raius-text-secondary">Collection not found</p>
          <Link to="/collections" className="text-micro text-raius-warm mt-4 inline-block hover:underline">
            VIEW ALL COLLECTIONS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-raius-bg pt-20 md:pt-24">
      {/* Hero */}
      <div className="relative aspect-[16/7] md:aspect-[16/5] overflow-hidden">
        <img
          src={collection.image}
          alt={collection.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <span className="text-micro tracking-[0.3em] text-raius-warm">{collection.title}</span>
          <h1 className="font-display text-4xl md:text-6xl text-raius-text mt-3">{collection.name}</h1>
          <p className="text-raius-text-secondary mt-3 max-w-lg text-center">{collection.subtitle}</p>
        </div>
      </div>

      {/* Products */}
      <div className="container-rai py-12">
        <p className="text-micro text-raius-text-tertiary mb-8">{collectionProducts.length} PRODUCTS</p>
        {collectionProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {collectionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-raius-text-secondary">No products in this collection yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
