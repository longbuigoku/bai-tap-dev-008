import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import {
  selectUITheme,
  selectActiveTab,
  selectNotification,
  toggleTheme,
  setActiveTab,
  setNotification,
} from './features/ui/uiSlice';
import { OrdersDashboard } from './features/orders/OrdersDashboard';
import { StoreArchitectureDoc } from './components/StoreArchitectureDoc';
import './App.css';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectUITheme);
  const activeTab = useAppSelector(selectActiveTab);
  const notification = useAppSelector(selectNotification);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="brand-group" onClick={() => dispatch(setActiveTab('orders'))}>
            <div className="brand-icon">
              {/* Redux Logo SVG */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16.5 13.5a4.5 4.5 0 0 1-4.5 4.5c-2.485 0-4.5-2.015-4.5-4.5s2.015-4.5 4.5-4.5c1.1 0 2.1.4 2.8 1.1l2.8-2.8C16.2 5.9 14.2 5 12 5 7.58 5 4 8.58 4 13s3.58 8 8 8 8-3.58 8-8c0-.7-.1-1.4-.3-2H16.5v2.5z"
                  fill="#764ABC"
                />
              </svg>
            </div>
            <div>
              <h1 className="brand-title">RTK OrderHub</h1>
              <p className="brand-subtitle">Redux Toolkit &bull; Modular Store Architecture</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="nav-links">
            <button
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => dispatch(setActiveTab('orders'))}
            >
              📦 Quản Lý Đơn Hàng (Slice)
            </button>
            <button
              className={`nav-item ${activeTab === 'architecture' ? 'active' : ''}`}
              onClick={() => dispatch(setActiveTab('architecture'))}
            >
              📐 Kiến Trúc Module & Biện Luận
            </button>
          </nav>

          {/* Theme switcher */}
          <button
            className="theme-btn"
            onClick={() => dispatch(toggleTheme())}
            title="Đổi giao diện Dark/Light"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Global Notification Banner */}
      {notification && (
        <div className="toast-bar">
          <div className="toast-box">
            <span>{notification.message}</span>
            <button
              className="toast-close"
              onClick={() => dispatch(setNotification(null))}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-wrapper">
        {activeTab === 'orders' ? <OrdersDashboard /> : <StoreArchitectureDoc />}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          🚀 <strong>Redux Toolkit (RTK) Modular Project</strong> — Slice hoàn chỉnh: <code>createSlice</code>, <code>createAsyncThunk</code>, <code>createSelector</code> (Reselect), kết hợp phác thảo kiến trúc module cho dự án thực tế.
        </p>
      </footer>
    </div>
  );
};

export default App;
