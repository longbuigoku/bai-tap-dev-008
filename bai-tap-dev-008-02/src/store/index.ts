import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import ordersReducer from '../features/orders/ordersSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    ui: uiReducer,
  },
  devTools: true,
});

// Kiểu State và Dispatch tự động suy luận từ configureStore
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom typed hooks chuẩn của Redux Toolkit
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
