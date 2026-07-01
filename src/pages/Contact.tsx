import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: 'general', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-raius-bg pt-20 md:pt-24">
      <div className="container-rai max-w-[900px] mx-auto py-8 md:py-12">
        <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-raius-text">Get in Touch</h1>
        <p className="text-raius-text-secondary mt-3 max-w-[500px]">
          We&apos;d love to hear from you. Whether it&apos;s a question about an order, a collaboration inquiry, or just to say hello.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center border border-raius-glass-border flex-shrink-0">
                <Mail size={18} className="text-raius-warm" />
              </div>
              <div>
                <p className="text-micro text-raius-text mb-1">EMAIL</p>
                <p className="text-sm text-raius-text-secondary">support@raius.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center border border-raius-glass-border flex-shrink-0">
                <Phone size={18} className="text-raius-warm" />
              </div>
              <div>
                <p className="text-micro text-raius-text mb-1">PHONE</p>
                <p className="text-sm text-raius-text-secondary">+44 20 7946 0958</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center border border-raius-glass-border flex-shrink-0">
                <MapPin size={18} className="text-raius-warm" />
              </div>
              <div>
                <p className="text-micro text-raius-text mb-1">ADDRESS</p>
                <p className="text-sm text-raius-text-secondary">
                  42 Rivington Street<br />
                  Shoreditch, London<br />
                  EC2A 3LX, United Kingdom
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-raius-glass-border">
              <p className="text-micro text-raius-text mb-3">FOLLOW US</p>
              <div className="flex gap-4">
                <a href="#" className="text-sm text-raius-text-secondary hover:text-raius-warm transition-colors">Instagram</a>
                <a href="#" className="text-sm text-raius-text-secondary hover:text-raius-warm transition-colors">TikTok</a>
                <a href="#" className="text-sm text-raius-text-secondary hover:text-raius-warm transition-colors">X</a>
                <a href="#" className="text-sm text-raius-text-secondary hover:text-raius-warm transition-colors">Facebook</a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <div className="text-center py-12">
                <p className="text-raius-warm text-lg">Message sent successfully.</p>
                <p className="text-raius-text-secondary mt-2">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Name"
                  required
                  className="w-full bg-raius-elevated border border-raius-glass-border text-raius-text placeholder:text-raius-text-tertiary px-4 py-3 outline-none focus:border-raius-warm transition-colors"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email"
                  required
                  className="w-full bg-raius-elevated border border-raius-glass-border text-raius-text placeholder:text-raius-text-tertiary px-4 py-3 outline-none focus:border-raius-warm transition-colors"
                />
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-raius-elevated border border-raius-glass-border text-raius-text px-4 py-3 outline-none focus:border-raius-warm transition-colors"
                >
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Support</option>
                  <option value="collab">Collaboration</option>
                  <option value="press">Press</option>
                </select>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Your message"
                  required
                  rows={5}
                  className="w-full bg-raius-elevated border border-raius-glass-border text-raius-text placeholder:text-raius-text-tertiary px-4 py-3 outline-none focus:border-raius-warm transition-colors resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-4 bg-raius-warm text-raius-bg text-micro tracking-[0.1em] hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  SEND MESSAGE
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
