import type { StateCreator } from 'zustand';
import type { UserProfile, NotificationItem } from '../types';

export interface UserSlice {
  user: UserProfile;
  notifications: NotificationItem[];
  theme: 'dark' | 'light';
  isCartOpen: boolean;
  activeTab: 'catalog' | 'cart' | 'settings' | 'inventory';
  updateUser: (patch: Partial<UserProfile>) => void;
  toggleTheme: () => void;
  setCartOpen: (open: boolean) => void;
  setActiveTab: (tab: 'catalog' | 'cart' | 'settings' | 'inventory') => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-889',
  name: 'Alex Nguyễn',
  email: 'alex.nguyen@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  role: 'customer',
  currency: 'USD',
  theme: 'dark',
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Chào mừng bạn!',
    message: 'Store Zustand đã được khởi tạo thành công với tính năng Persist.',
    timestamp: 'Vừa xong',
    type: 'system',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Ưu đãi Tech Deal 2026',
    message: 'Giảm 10% cho tất cả thiết bị điện tử khi nhập mã ZUSTAND2026.',
    timestamp: '1 giờ trước',
    type: 'deal',
    read: false,
  },
];

export const createUserSlice: StateCreator<
  UserSlice,
  [],
  [],
  UserSlice
> = (set) => ({
  user: DEFAULT_USER,
  notifications: INITIAL_NOTIFICATIONS,
  theme: 'dark',
  isCartOpen: false,
  activeTab: 'catalog',

  updateUser: (patch) =>
    set((state) => ({
      user: { ...state.user, ...patch },
    })),

  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      return {
        theme: nextTheme,
        user: { ...state.user, theme: nextTheme },
      };
    }),

  setCartOpen: (isCartOpen) => set({ isCartOpen }),

  setActiveTab: (activeTab) => set({ activeTab }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: `notif-${Date.now()}`,
          timestamp: 'Vừa xong',
          read: false,
        },
        ...state.notifications,
      ],
    })),

  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  clearNotifications: () => set({ notifications: [] }),
});
