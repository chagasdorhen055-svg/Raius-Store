import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, User, Order } from '@/types';

interface AppState {
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, color: string, size: string) => void;
  updateQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;

  // UI
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Admin
  isAdmin: boolean;
  products: Product[];
  setProducts: (products: Product[]) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addProduct: (product: Product) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (item) => {
        const { cart } = get();
        const existing = cart.find(
          (c) => c.product.id === item.product.id && c.color === item.color && c.size === item.size
        );
        if (existing) {
          set({
            cart: cart.map((c) =>
              c.product.id === item.product.id && c.color === item.color && c.size === item.size
                ? { ...c, quantity: c.quantity + item.quantity }
                : c
            ),
          });
        } else {
          set({ cart: [...cart, item] });
        }
      },
      removeFromCart: (productId, color, size) => {
        set({
          cart: get().cart.filter(
            (c) => !(c.product.id === productId && c.color === color && c.size === size)
          ),
        });
      },
      updateQuantity: (productId, color, size, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, color, size);
          return;
        }
        set({
          cart: get().cart.map((c) =>
            c.product.id === productId && c.color === color && c.size === size
              ? { ...c, quantity }
              : c
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      cartTotal: () => get().cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      cartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),

      // Wishlist
      wishlist: [],
      toggleWishlist: (productId) => {
        const { wishlist } = get();
        if (wishlist.includes(productId)) {
          set({ wishlist: wishlist.filter((id) => id !== productId) });
        } else {
          set({ wishlist: [...wishlist, productId] });
        }
      },
      isInWishlist: (productId) => get().wishlist.includes(productId),

      // Auth
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, isAdmin: false }),

      // Orders
      orders: [],
      addOrder: (order) => set({ orders: [...get().orders, order] }),

      // UI
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      isSearchOpen: false,
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

      // Admin
      isAdmin: false,
      products: [],
      setProducts: (products) => set({ products }),
      updateProduct: (product) => {
        set({
          products: get().products.map((p) => (p.id === product.id ? product : p)),
        });
      },
      deleteProduct: (productId) => {
        set({
          products: get().products.filter((p) => p.id !== productId),
        });
      },
      addProduct: (product) => {
        set({ products: [...get().products, product] });
      },
    }),
    {
      name: 'raius-storage',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        orders: state.orders,
      }),
    }
  )
);
