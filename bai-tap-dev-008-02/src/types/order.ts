export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  trackingCode?: string;
  note?: string;
}

export interface OrdersFilter {
  searchQuery: string;
  status: OrderStatus | 'all';
  sortBy: 'createdAt-desc' | 'createdAt-asc' | 'totalAmount-desc' | 'totalAmount-asc';
}
