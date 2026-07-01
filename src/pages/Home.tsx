import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Star } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { getBestsellers, getNewArrivals, categories, testimonials } from '@/data/products';

import { TextScramble } from '@/lib/textScramble';

gsap.registerPlugin(ScrollTrigger);

const CylinderCarousel = lazy(() => import('@/components/CylinderCarousel'));

export default function Home() {
  return (
    <main className="bg-raius-bg">
      <HeroSection />
      <KineticManifesto />
      <FeaturedCollection />
      <Suspense fallback={<div className="h-screen bg-raius-bg" />}>
        <CylinderCarousel />
      </Suspense>
      <BestSellers />
      <NewArrivals />
      <BrandPhilosophy />
      <CategoryNav />
      <SocialProof />
      <Newsletter />
    </main>
  );
}

/* ==================== HERO SECTION ==================== */
function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Headline scramble
    if (headlineRef.current) {
      const scramble = new TextScramble(headlineRef.current);
      const timer = setTimeout(() => scramble.setText('RAIUS'), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.5 });
    if (sublineRef.current) {
      tl.to(sublineRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    }
    if (ctaRef.current) {
      tl.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');
    }
    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[100dvh] flex items-end overflow-hidden">
      {/* Background Image (instead of video for performance) */}
      <div className="absolute inset-0">
        <img
          src="/images/about/hero.jpg"
          alt="RAIUS editorial"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.1) 40%, rgba(5,5,5,0.7) 100%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container-rai pb-[15vh] md:pb-[20vh]">
        <h1
          ref={headlineRef}
          className="font-display text-[clamp(4rem,14vw,10rem)] text-raius-cream uppercase leading-[0.9] tracking-[-0.03em]"
        >
          RAIUS
        </h1>
        <p
          ref={sublineRef}
          className="text-micro tracking-[0.3em] text-raius-text-secondary mt-4 opacity-0 translate-y-5"
        >
          PREMIUM STREETWEAR
        </p>
        <button
          ref={ctaRef}
          onClick={() => navigate('/shop')}
          className="mt-8 text-micro tracking-[0.1em] text-raius-cream border border-raius-cream px-10 py-3.5 hover:bg-raius-cream hover:text-raius-bg transition-all duration-300 opacity-0 translate-y-4"
        >
          SHOP COLLECTION
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-px h-10 bg-raius-cream/40 animate-[pulse-line_1.5s_ease-in-out_infinite]" />
      </div>
    </section>
  );
}

/* ==================== KINETIC MANIFESTO ==================== */
function KineticManifesto() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const text = 'INDIVIDUALITY';
    const chars: HTMLSpanElement[] = [];
    textRef.current.innerHTML = '';

    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.textContent = text[i];
      span.className = 'char inline-block will-change-transform';
      span.style.display = 'inline-block';
      textRef.current.appendChild(span);
      chars.push(span);
    }

    let scrollVelocity = 0;
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        scrollVelocity = self.getVelocity() / 1000;
      },
    });

    const animateWave = (time: number) => {
      scrollVelocity *= 0.95;
      const amplitude = 10 + Math.abs(scrollVelocity) * 20;

      chars.forEach((char, i) => {
        const phase = (i / chars.length) * Math.PI * 4 + time * 2;
        const offset = Math.sin(phase) * amplitude;
        char.style.transform = `translateY(${offset}px)`;
      });

      gsap.ticker.add(animateWave);
      gsap.ticker.remove(animateWave);
      requestAnimationFrame(() => gsap.ticker.add(animateWave));
    };

    gsap.ticker.add(animateWave);

    if (bodyRef.current) {
      gsap.to(bodyRef.current, {
        opacity: 1,
        y: 0,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        duration: 0.6,
      });
    }

    return () => {
      st.kill();
      gsap.ticker.remove(animateWave);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-[80px] md:py-[120px] bg-raius-bg overflow-hidden">
      <div className="container-rai">
        <div
          ref={textRef}
          className="font-display text-[clamp(3rem,10vw,8rem)] text-raius-cream uppercase leading-[0.8] tracking-[-0.02em] flex justify-between w-full whitespace-nowrap"
        />
        <p
          ref={bodyRef}
          className="text-center text-raius-text-secondary max-w-[480px] mx-auto mt-10 opacity-0 translate-y-5"
        >
          Every piece tells a story. Every thread carries intent.
        </p>
      </div>
    </section>
  );
}

/* ==================== FEATURED COLLECTION ==================== */
function FeaturedCollection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        opacity: 0,
        x: -40,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        duration: 0.8,
        ease: 'power2.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const collectionImages = [
    '/images/products/puffer-black.jpg',
    '/images/products/overshirt-navy.jpg',
    '/images/products/denim-jacket.jpg',
    '/images/products/hoodie-black.jpg',
  ];

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] bg-raius-bg flex items-center overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-raius-elevated/30" />

      <div className="relative z-10 container-rai w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text */}
          <div ref={textRef}>
            <span className="text-micro tracking-[0.2em] text-raius-warm">NEW DROP</span>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-raius-text mt-4 leading-[1.1]">
              Autumn/Winter 2025
            </h2>
            <p className="text-raius-text-secondary mt-6 max-w-[400px] leading-relaxed">
              A study in texture and silence. Heavyweight cotton, structured silhouettes, and the quiet confidence of pieces designed to endure.
            </p>
            <button
              onClick={() => navigate('/collections/aw25')}
              className="mt-8 text-micro tracking-[0.1em] text-raius-warm border border-raius-warm px-8 py-3 hover:bg-raius-warm hover:text-raius-bg transition-all duration-300"
            >
              EXPLORE COLLECTION
            </button>
          </div>

          {/* Right: Image Grid */}
          <div className="grid grid-cols-2 gap-3">
            {collectionImages.map((img, i) => (
              <div
                key={i}
                className="aspect-[3/4] overflow-hidden bg-raius-hover"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <img
                  src={img}
                  alt={`Collection look ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================== BEST SELLERS ==================== */
function BestSellers() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const bestsellers = getBestsellers();

  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.children;
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-[60px] md:py-[120px] bg-raius-elevated">
      <div className="container-rai">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] text-raius-text leading-[1.1]">BEST SELLERS</h2>
            <p className="text-raius-text-secondary mt-2 max-w-[500px]">
              The pieces our community returns to, season after season.
            </p>
          </div>
          <button
            onClick={() => navigate('/shop?filter=bestsellers')}
            className="text-micro tracking-[0.1em] text-raius-warm hover:underline whitespace-nowrap flex items-center gap-2"
          >
            VIEW ALL <ArrowRight size={14} />
          </button>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {bestsellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================== NEW ARRIVALS ==================== */
function NewArrivals() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const newArrivals = getNewArrivals();

  useEffect(() => {
    if (!stripRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(stripRef.current, {
        x: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-[60px] md:py-[120px] bg-raius-bg">
      <div className="container-rai mb-8">
        <h2 className="font-display text-[clamp(2rem,5vw,4rem)] text-raius-text leading-[1.1]">NEW ARRIVALS</h2>
        <p className="text-raius-text-secondary mt-2">Fresh drops, limited runs.</p>
      </div>

      {/* Horizontal Scroll Strip */}
      <div
        ref={stripRef}
        className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory container-rai pb-4"
      >
        {newArrivals.map((product) => (
          <div key={product.id} className="w-[260px] md:w-[280px] flex-shrink-0 snap-start">
            <ProductCard product={product} showNewBadge />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ==================== BRAND PHILOSOPHY ==================== */
function BrandPhilosophy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.philosophy-image', {
        x: -40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });
      gsap.from('.philosophy-text > *', {
        y: 20,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-[60px] md:py-[120px] bg-raius-elevated">
      <div className="container-rai">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div className="philosophy-image aspect-[4/5] overflow-hidden">
            <img
              src="/images/about/philosophy.jpg"
              alt="RAIUS brand philosophy"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div className="philosophy-text">
            <span className="text-micro tracking-[0.2em] text-raius-warm">THE RAIUS WAY</span>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] text-raius-text mt-4 leading-[1.15]">
              Crafted for Those Who Move Differently
            </h2>
            <p className="text-raius-text-secondary mt-6 max-w-[480px] leading-relaxed">
              We believe in the power of restraint. Every RAIUS garment is designed with precision — premium fabrics, architectural silhouettes, and an unwavering commitment to quality. Our pieces don&apos;t follow trends; they outlast them.
            </p>
            <button
              onClick={() => navigate('/about')}
              className="mt-8 text-micro tracking-[0.1em] text-raius-text border border-raius-text-secondary px-8 py-3 hover:border-raius-warm hover:text-raius-warm transition-all duration-300"
            >
              READ OUR STORY
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================== CATEGORY NAVIGATION ==================== */
function CategoryNav() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.category-tile', {
        scale: 0.95,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-raius-bg">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/shop?category=${cat.slug}`)}
            className="category-tile relative aspect-square lg:aspect-[4/3] overflow-hidden group"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-400" />
            <span className="absolute inset-0 flex items-center justify-center font-display text-[clamp(1.5rem,3vw,2.5rem)] text-raius-text uppercase group-hover:text-raius-cream transition-colors duration-400">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ==================== SOCIAL PROOF ==================== */
function SocialProof() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.testimonial-card', {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-[60px] md:py-[120px] bg-raius-bg">
      <div className="container-rai max-w-[1100px] mx-auto">
        <p className="text-micro text-raius-text-tertiary text-center tracking-[0.2em]">WHAT THEY&apos;RE SAYING</p>
        <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] text-raius-text text-center mt-3">
          Trusted by 50,000+ worldwide
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="testimonial-card bg-raius-glass border border-raius-glass-border p-8"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-raius-warm text-raius-warm" />
                ))}
              </div>
              <p className="text-raius-text leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-sm text-raius-text-secondary mt-4">{t.name}</p>
              <p className="text-micro text-raius-text-tertiary tracking-normal">{t.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================== NEWSLETTER ==================== */
function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.newsletter-content', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-raius-elevated">
      <div className="container-rai max-w-[600px] mx-auto newsletter-content text-center">
        <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] text-raius-text">
          Join the Inner Circle
        </h2>
        <p className="text-raius-text-secondary mt-3">
          Early access to drops, exclusive offers, and stories from the atelier. No noise, only signal.
        </p>

        {submitted ? (
          <p className="text-raius-warm mt-8">Thank you for subscribing.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 bg-raius-bg border border-raius-glass-border text-raius-text placeholder:text-raius-text-tertiary px-5 py-3.5 outline-none focus:border-raius-warm transition-colors"
            />
            <button
              type="submit"
              className="bg-raius-warm text-raius-bg text-micro tracking-[0.1em] px-7 py-3.5 hover:brightness-110 transition-all whitespace-nowrap"
            >
              SUBSCRIBE
            </button>
          </form>
        )}

        <p className="text-micro text-raius-text-tertiary mt-4 tracking-normal">
          By subscribing, you agree to our Privacy Policy.
        </p>
      </div>
    </section>
  );
}
