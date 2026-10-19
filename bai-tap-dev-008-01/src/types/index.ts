export interface Product {
  id: string;
  name: string;
  category: 'laptop' | 'phone' | 'audio' | 'accessory';
  price: number;
  rating: number;
  stock: number;
  image: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'customer';
  currency: 'USD' | 'VND';
  theme: 'dark' | 'light';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'system' | 'deal';
  read: boolean;
}
