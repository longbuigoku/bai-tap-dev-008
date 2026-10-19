import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ProductsSlice } from './productsSlice';
import { createProductsSlice } from './productsSlice';
import type { CartSlice } from './cartSlice';
import { createCartSlice } from './cartSlice';
import type { UserSlice } from './userSlice';
import { createUserSlice } from './userSlice';

// Hợp nhất kiểu Root Store từ 3 Slice độc lập
export type RootStore = ProductsSlice & CartSlice & UserSlice;

export const useStore = create<RootStore>()(
  persist(
    (...a) => ({
      ...createProductsSlice(...a),
      ...createCartSlice(...a),
      ...createUserSlice(...a),
    }),
    {
      name: 'app-ecommerce-zustand-store', // Tên key lưu trong localStorage
      storage: createJSONStorage(() => localStorage),
      // Chọn lọc các phần dữ liệu cần persist lâu dài (tránh lưu các state tạm thời như searchQuery hay modal open)
      partialize: (state) => ({
        products: state.products,
        cart: state.cart,
        user: state.user,
        theme: state.theme,
        notifications: state.notifications,
      }),
    }
  )
);
