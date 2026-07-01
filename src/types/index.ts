export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  collection: string;
  description: string;
  shortDescription: string;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  rating: number;
  reviewCount: number;
  fabric: string;
  care: string[];
  modelInfo: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  color: string;
  size: string;
}

export interface WishlistItem {
  productId: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'processing' | 'shipped' | 'delivered';
  date: string;
  shippingAddress: Address;
}

export interface Address {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  addresses: Address[];
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  location: string;
  rating: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export interface Collection {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  image: string;
  slug: string;
}
