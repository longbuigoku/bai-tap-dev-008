import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

export interface UIState {
  theme: 'dark' | 'light';
  activeTab: 'orders' | 'architecture';
  isCreateModalOpen: boolean;
  notification: {
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
  } | null;
}

const initialState: UIState = {
  theme: 'dark',
  activeTab: 'orders',
  isCreateModalOpen: false,
  notification: {
    message: 'Chào mừng! RTK Store đã được khởi tạo theo kiến trúc module chuẩn.',
    type: 'info',
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setActiveTab: (
      state,
      action: PayloadAction<'orders' | 'architecture'>
    ) => {
      state.activeTab = action.payload;
    },
    setCreateModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateModalOpen = action.payload;
    },
    setNotification: (
      state,
      action: PayloadAction<{
        message: string;
        type: 'success' | 'info' | 'warning' | 'error';
      } | null>
    ) => {
      state.notification = action.payload;
    },
  },
});

export const { toggleTheme, setActiveTab, setCreateModalOpen, setNotification } =
  uiSlice.actions;

export const selectUITheme = (state: RootState) => state.ui.theme;
export const selectActiveTab = (state: RootState) => state.ui.activeTab;
export const selectIsCreateModalOpen = (state: RootState) =>
  state.ui.isCreateModalOpen;
export const selectNotification = (state: RootState) => state.ui.notification;

export default uiSlice.reducer;
