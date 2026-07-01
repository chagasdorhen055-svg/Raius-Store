import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Lock } from 'lucide-react';
import { useStore } from '@/store';
import { formatPrice, generateOrderId } from '@/lib/utils';
import type { Address } from '@/types';

const SHIPPING_METHODS = [
  { id: 'standard', name: 'Standard Shipping', time: '3-5 business days', price: 0 },
  { id: 'express', name: 'Express Shipping', time: '1-2 business days', price: 15 },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, addOrder, user } = useStore();
  const [step, setStep] = useState<'info' | 'shipping' | 'payment' | 'confirm'>('info');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState<Partial<Address>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [orderId, setOrderId] = useState('');

  if (cart.length === 0 && step !== 'confirm') {
    return (
      <div className="min-h-screen bg-raius-bg flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-raius-text-secondary">Your bag is empty</p>
          <button
            onClick={() => navigate('/shop')}
            className="mt-4 text-micro text-raius-warm hover:underline"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  const shippingCost = SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.price || 0;
  const total = cartTotal() + shippingCost;

  const handlePlaceOrder = () => {
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    addOrder({
      id: newOrderId,
      items: [...cart],
      total,
      status: 'processing',
      date: new Date().toISOString(),
      shippingAddress: address as Address,
    });
    clearCart();
    setStep('confirm');
  };

  return (
    <main className="min-h-screen bg-raius-bg pt-20 md:pt-24">
      <div className="container-rai max-w-[900px] mx-auto py-8 md:py-12">
        {/* Progress */}
        {step !== 'confirm' && (
          <div className="flex items-center justify-center gap-4 mb-10">
            {(['info', 'shipping', 'payment'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-4">
                <div className={`w-8 h-8 flex items-center justify-center text-micro ${
                  step === s ? 'bg-raius-warm text-raius-bg' :
                  ['info', 'shipping', 'payment'].indexOf(step) > i ? 'bg-raius-text text-raius-bg' :
                  'border border-raius-text-tertiary text-raius-text-tertiary'
                }`}>
                  {['info', 'shipping', 'payment'].indexOf(step) > i ? <Check size={14} /> : i + 1}
                </div>
                {i < 2 && <div className={`w-8 h-px ${['info', 'shipping', 'payment'].indexOf(step) > i ? 'bg-raius-text' : 'bg-raius-glass-border'}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Customer Info */}
        {step === 'info' && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl text-raius-text">Contact Information</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-raius-elevated border border-raius-glass-border text-raius-text placeholder:text-raius-text-tertiary px-4 py-3 outline-none focus:border-raius-warm transition-colors"
            />

            <h2 className="font-display text-2xl text-raius-text pt-4">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={address.firstName}
                onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                placeholder="First name"
                className="w-full bg-raius-elevated border border-raius-glass-border text-raius-text placeholder:text-raius-text-tertiary px-4 py-3 outline-none focus:border-raius-warm"
              />
              <input
                type="text"
                value={address.lastName}
                onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                placeholder="Last name"
                className="w-full bg-raius-elevated border border-raius-glass-border text-raius-text placeholder:text-raius-text-tertiary px-4 py-3 outline-none focus:border-raius-warm"
              />
            </div>
            <input
              type="text"
              value={address.address}
              onChange={(e) => setAddress({ ...address, address: e.target.value })}
              placeholder="Address"
              className="w-full bg-raius-elevated border border-raius-glass-border text-raius-text placeholder:text-raius-text-tertiary px-4 py-3 outline-none focus:border-raius-warm"
            />
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                placeholder="City"
                className="w-full bg-raius-elevated border border-raius-glass-border text-raius-text placeholder:text-raius-text-tertiary px-4 py-3 outline-none focus:border-raius-warm"
              />
              <input
                type="text"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                placeholder="State"
                className="w-full bg-raius-elevated border border-raius-glass-border text-raius-text placeholder:text-raius-text-tertiary px-4 py-3 outline-none focus:border-raius-warm"
              />
              <input
                type="text"
                value={address.zip}
                onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                placeholder="ZIP"
                className="w-full bg-raius-elevated border border-raius-glass-border text-raius-text placeholder:text-raius-text-tertiary px-4 py-3 outline-none focus:border-raius-warm"
              />
            </div>

            <button
              onClick={() => setStep('shipping')}
              className="w-full py-4 bg-raius-warm text-raius-bg text-micro tracking-[0.1em] hover:brightness-110 transition-all mt-4"
            >
              CONTINUE TO SHIPPING
            </button>
          </div>
        )}

        {/* Step 2: Shipping */}
        {step === 'shipping' && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl text-raius-text">Shipping Method</h2>
            <div className="space-y-3">
              {SHIPPING_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setShippingMethod(method.id)}
                  className={`w-full flex items-center justify-between p-4 border transition-all ${
                    shippingMethod === method.id ? 'border-raius-warm bg-raius-warm/5' : 'border-raius-glass-border'
                  }`}
                >
                  <div className="text-left">
                    <p className="text-sm text-raius-text font-medium">{method.name}</p>
                    <p className="text-xs text-raius-text-secondary">{method.time}</p>
                  </div>
                  <p className="text-sm text-raius-text">{method.price === 0 ? 'Free' : formatPrice(method.price)}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep('payment')}
              className="w-full py-4 bg-raius-warm text-raius-bg text-micro tracking-[0.1em] hover:brightness-110 transition-all mt-4"
            >
              CONTINUE TO PAYMENT
            </button>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 'payment' && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl text-raius-text">Payment</h2>

            {/* Order Summary */}
            <div className="bg-raius-elevated p-6 space-y-4">
              <h3 className="text-micro text-raius-text">ORDER SUMMARY</h3>
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.color}-${item.size}`} className="flex justify-between text-sm">
                  <span className="text-raius-text-secondary">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="text-raius-text">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-raius-glass-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-raius-text-secondary">Subtotal</span>
                  <span className="text-raius-text">{formatPrice(cartTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-raius-text-secondary">Shipping</span>
                  <span className="text-raius-text">{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold border-t border-raius-glass-border pt-3">
                  <span className="text-raius-text">Total</span>
                  <span className="text-raius-text">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-2">
              {['Credit Card', 'PayPal', 'Apple Pay', 'Google Pay'].map((method) => (
                <div key={method} className="flex items-center gap-3 p-4 border border-raius-glass-border">
                  <div className="w-4 h-4 rounded-full border border-raius-text-secondary" />
                  <span className="text-sm text-raius-text">{method}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full py-4 bg-raius-warm text-raius-bg text-micro tracking-[0.1em] hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <Lock size={14} />
              PLACE ORDER
            </button>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 'confirm' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-raius-warm/20 flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-raius-warm" />
            </div>
            <h2 className="font-display text-3xl text-raius-text">Thank You</h2>
            <p className="text-raius-text-secondary mt-3">Your order has been placed successfully.</p>
            <p className="text-micro text-raius-text-tertiary mt-2">Order #{orderId}</p>
            <button
              onClick={() => navigate('/shop')}
              className="mt-8 text-micro text-raius-warm border border-raius-warm px-8 py-3 hover:bg-raius-warm hover:text-raius-bg transition-all"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
