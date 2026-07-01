import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Clock, Leaf } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: <Award size={28} strokeWidth={1.5} />,
    title: 'Premium Materials',
    description: 'Only the finest cotton, sourced responsibly and crafted to last. Every fabric is hand-selected for quality, texture, and longevity.',
  },
  {
    icon: <Clock size={28} strokeWidth={1.5} />,
    title: 'Timeless Design',
    description: 'Architectural silhouettes that transcend seasonal trends. We create pieces that look as good in ten years as they do today.',
  },
  {
    icon: <Leaf size={28} strokeWidth={1.5} />,
    title: 'Sustainable Practice',
    description: 'Small-batch production, minimal waste, maximum quality. We believe in doing more with less.',
  },
];

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-story > *', {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        scrollTrigger: { trigger: storyRef.current, start: 'top 70%' },
      });
      gsap.from('.value-card', {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        scrollTrigger: { trigger: '.values-grid', start: 'top 80%' },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-raius-bg pt-20 md:pt-24">
      {/* Hero */}
      <div ref={heroRef} className="relative aspect-[16/7] md:aspect-[21/9] overflow-hidden">
        <img
          src="/images/about/hero.jpg"
          alt="RAIUS brand"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-display text-[clamp(3rem,10vw,8rem)] text-raius-text text-center">
            About RAIUS
          </h1>
        </div>
      </div>

      {/* Story */}
      <div ref={storyRef} className="container-rai max-w-[720px] mx-auto py-16 md:py-24">
        <div className="about-story">
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] text-raius-text">
            Born from Restraint
          </h2>
          <p className="text-raius-text-secondary mt-6 leading-[1.8]">
            RAIUS was founded in London with a singular vision: to create clothing that bridges the gap between streetwear and luxury. We saw a world flooded with fast fashion and disposable trends, and we chose a different path.
          </p>
          <p className="text-raius-text-secondary mt-4 leading-[1.8]">
            Every garment we produce is designed with intention. We source the finest materials from trusted mills across Europe and Asia, partnering with factories that share our commitment to ethical production and exceptional craftsmanship.
          </p>
          <p className="text-raius-text-secondary mt-4 leading-[1.8]">
            Our design philosophy is rooted in restraint. We believe the most powerful statements are often the quietest. Clean lines, premium fabrics, and meticulous attention to detail define every piece in our collection.
          </p>

          <blockquote className="font-display text-[clamp(1.5rem,3vw,2.5rem)] text-raius-cream text-center my-16 leading-[1.3]">
            &ldquo;We don&apos;t design for trends. We design for permanence.&rdquo;
          </blockquote>

          <p className="text-raius-text-secondary leading-[1.8]">
            From our signature heavyweight hoodies to our structured outerwear, each piece is built to endure — both in construction and in style. We create wardrobe foundations that our customers reach for day after day, year after year.
          </p>
        </div>
      </div>

      {/* Process Images */}
      <div className="container-rai max-w-[900px] mx-auto pb-16">
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square bg-raius-elevated overflow-hidden">
            <img src="/images/categories/hoodies.jpg" alt="Atelier" className="w-full h-full object-cover" />
          </div>
          <div className="aspect-square bg-raius-elevated overflow-hidden">
            <img src="/images/categories/tees.jpg" alt="Materials" className="w-full h-full object-cover" />
          </div>
          <div className="aspect-square bg-raius-elevated overflow-hidden">
            <img src="/images/categories/jackets.jpg" alt="Craftsmanship" className="w-full h-full object-cover" />
          </div>
          <div className="aspect-square bg-raius-elevated overflow-hidden">
            <img src="/images/categories/accessories.jpg" alt="Packaging" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-raius-elevated py-16 md:py-24">
        <div className="container-rai max-w-[1100px] mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-raius-text text-center mb-12">Our Values</h2>
          <div className="values-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className="value-card text-center">
                <div className="w-14 h-14 flex items-center justify-center mx-auto text-raius-warm">
                  {v.icon}
                </div>
                <h3 className="text-base font-medium text-raius-text mt-4">{v.title}</h3>
                <p className="text-sm text-raius-text-secondary mt-3 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
