import type { StateCreator } from 'zustand';
import type { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';

export interface ProductsSlice {
  products: Product[];
  selectedCategory: string;
  searchQuery: string;
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'name';
  setCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'price-asc' | 'price-desc' | 'rating' | 'name') => void;
  decreaseStock: (productId: string, quantity: number) => void;
  restockProduct: (productId: string, quantity: number) => void;
}

export const createProductsSlice: StateCreator<
  ProductsSlice,
  [],
  [],
  ProductsSlice
> = (set) => ({
  products: INITIAL_PRODUCTS,
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'rating',

  setCategory: (category) => set({ selectedCategory: category }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSortBy: (sortBy) => set({ sortBy }),

  decreaseStock: (productId, quantity) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, stock: Math.max(0, p.stock - quantity) } : p
      ),
    })),

  restockProduct: (productId, quantity) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, stock: p.stock + quantity } : p
      ),
    })),
});
