import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  const shopLinks = [
    { label: 'All Products', path: '/shop' },
    { label: 'New Arrivals', path: '/shop?filter=new' },
    { label: 'Best Sellers', path: '/shop?filter=bestsellers' },
    { label: 'Hoodies', path: '/shop?category=hoodies' },
    { label: 'T-Shirts', path: '/shop?category=t-shirts' },
    { label: 'Jackets', path: '/shop?category=jackets' },
    { label: 'Accessories', path: '/shop?category=accessories' },
  ];

  const companyLinks = [
    { label: 'About RAIUS', path: '/about' },
    { label: 'Sustainability', path: '/about' },
    { label: 'Careers', path: '#' },
    { label: 'Press', path: '#' },
    { label: 'Contact', path: '/contact' },
  ];

  const supportLinks = [
    { label: 'Shipping Info', path: '#' },
    { label: 'Returns', path: '#' },
    { label: 'Size Guide', path: '#' },
    { label: 'FAQ', path: '#' },
    { label: 'Track Order', path: '#' },
  ];

  return (
    <footer className="bg-raius-bg border-t border-raius-grid">
      <div className="container-rai pt-16 pb-10">
        {/* Top Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-micro tracking-[0.2em] text-raius-text">RAIUS</span>
            <p className="mt-3 text-sm text-raius-text-tertiary max-w-[240px] leading-relaxed">
              Premium streetwear for the modern individual. Designed in London. Worn worldwide.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-micro tracking-[0.1em] text-raius-text mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-raius-text-secondary hover:text-raius-text transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-micro tracking-[0.1em] text-raius-text mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-raius-text-secondary hover:text-raius-text transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-micro tracking-[0.1em] text-raius-text mb-4">Support</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-raius-text-secondary hover:text-raius-text transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-12 pt-6 border-t border-raius-grid flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-micro text-raius-text-tertiary tracking-normal">
            &copy; 2025 RAIUS. All rights reserved.
          </p>

          {/* Payment Icons */}
          <div className="flex items-center gap-3">
            {['Visa', 'MC', 'Amex', 'PayPal', 'Apple'].map((method) => (
              <span key={method} className="text-micro text-raius-text-tertiary">{method}</span>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-raius-text-secondary hover:text-raius-text transition-colors" aria-label="Instagram">
              <Instagram size={18} strokeWidth={1.5} />
            </a>
            <a href="#" className="text-raius-text-secondary hover:text-raius-text transition-colors" aria-label="Twitter">
              <Twitter size={18} strokeWidth={1.5} />
            </a>
            <a href="#" className="text-raius-text-secondary hover:text-raius-text transition-colors" aria-label="Facebook">
              <Facebook size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
