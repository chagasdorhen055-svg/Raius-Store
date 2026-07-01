import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { cart, isCartOpen, setCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useStore();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 z-50"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[400px] bg-raius-elevated z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-raius-glass-border">
          <h2 className="text-micro tracking-[0.1em] text-raius-text">
            YOUR BAG ({cart.length})
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="text-raius-text-secondary hover:text-raius-text transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <ShoppingBag size={40} strokeWidth={1} className="text-raius-text-tertiary mb-4" />
              <p className="text-sm text-raius-text-secondary">Your bag is empty</p>
              <button
                onClick={() => { setCartOpen(false); navigate('/shop'); }}
                className="mt-4 text-micro text-raius-warm hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-raius-glass-border">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.color}-${item.size}`} className="p-5 flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-24 bg-raius-hover flex-shrink-0 overflow-hidden">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-raius-text truncate">{item.product.name}</h3>
                    <p className="text-xs text-raius-text-tertiary mt-1">
                      {item.color} / {item.size}
                    </p>
                    <p className="text-sm text-raius-text mt-1">{formatPrice(item.product.price)}</p>

                    {/* Quantity */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.color, item.size, item.quantity - 1)}
                        className="w-7 h-7 border border-raius-glass-border flex items-center justify-center text-raius-text-secondary hover:text-raius-text transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm text-raius-text w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.color, item.size, item.quantity + 1)}
                        className="w-7 h-7 border border-raius-glass-border flex items-center justify-center text-raius-text-secondary hover:text-raius-text transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.color, item.size)}
                        className="ml-auto text-xs text-raius-text-tertiary hover:text-raius-burgundy transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-raius-glass-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-raius-text-secondary">Subtotal</span>
              <span className="text-lg font-semibold text-raius-text">{formatPrice(cartTotal())}</span>
            </div>
            <button
              onClick={() => { setCartOpen(false); navigate('/checkout'); }}
              className="w-full py-4 bg-raius-warm text-raius-bg text-micro tracking-[0.1em] hover:brightness-110 transition-all"
            >
              CHECKOUT
            </button>
            <button
              onClick={() => { setCartOpen(false); navigate('/shop'); }}
              className="w-full py-3 border border-raius-text-secondary text-raius-text text-micro tracking-[0.1em] hover:border-raius-text transition-colors"
            >
              CONTINUE SHOPPING
            </button>
            <button
              onClick={clearCart}
              className="w-full text-xs text-raius-text-tertiary hover:text-raius-burgundy transition-colors"
            >
              Clear Bag
            </button>
          </div>
        )}
      </div>
    </>
  );
}
