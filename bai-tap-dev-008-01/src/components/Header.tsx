import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  ShoppingBagIcon, 
  SunIcon, 
  MoonIcon, 
  BellIcon, 
  DatabaseIcon, 
  LayersIcon, 
  SearchIcon 
} from './Icons';

export const Header: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const user = useStore((state) => state.user);
  const getCartCount = useStore((state) => state.getCartCount);
  const isCartOpen = useStore((state) => state.isCartOpen);
  const setCartOpen = useStore((state) => state.setCartOpen);
  const activeTab = useStore((state) => state.activeTab);
  const setActiveTab = useStore((state) => state.setActiveTab);
  const notifications = useStore((state) => state.notifications);
  const markNotificationAsRead = useStore((state) => state.markNotificationAsRead);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);

  const cartCount = getCartCount();
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="header-container">
      <div className="header-inner">
        {/* Brand / Logo */}
        <div className="logo-group" onClick={() => setActiveTab('catalog')}>
          <div className="logo-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ffffff' }}>
              <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
              <path d="M2 7h20" />
            </svg>
          </div>
          <div>
            <h1 className="brand-title">TechStore</h1>
            <p className="brand-subtitle">Zustand Multi-Slice &bull; Persist</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="search-bar-wrap">
          <SearchIcon size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm (tự đồng bộ store)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs">
          <button
            className={`tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            Sản Phẩm
          </button>
          <button
            className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <DatabaseIcon size={16} />
            <span>Kho Hàng</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <LayersIcon size={16} />
            <span>Kiến Trúc Store</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="header-actions">
          {/* Notification Menu */}
          <div className="notif-wrapper">
            <button 
              className="action-btn notif-btn" 
              onClick={() => setShowNotifications(!showNotifications)}
              title="Thông báo"
            >
              <BellIcon size={20} />
              {unreadNotifCount > 0 && (
                <span className="badge-count pulse">{unreadNotifCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <h4>Thông báo hệ thống ({notifications.length})</h4>
                  <span className="notif-sub">Tự động lưu vào persist</span>
                </div>
                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <p className="notif-empty">Không có thông báo mới</p>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`notif-item ${n.read ? 'read' : 'unread'}`}
                        onClick={() => markNotificationAsRead(n.id)}
                      >
                        <div className="notif-item-header">
                          <span className="notif-item-title">{n.title}</span>
                          <span className="notif-item-time">{n.timestamp}</span>
                        </div>
                        <p className="notif-item-msg">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            className="action-btn theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          >
            {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </button>

          {/* User Profile Avatar */}
          <div 
            className="user-pill"
            onClick={() => setActiveTab('settings')}
            title="Tài khoản người dùng"
          >
            <img src={user.avatar} alt={user.name} className="user-avatar" />
            <span className="user-name">{user.name}</span>
          </div>

          {/* Cart Trigger Button */}
          <button
            className="cart-trigger-btn"
            onClick={() => setCartOpen(!isCartOpen)}
          >
            <ShoppingBagIcon size={20} />
            <span className="cart-text">Giỏ Hàng</span>
            <span className="cart-counter-badge">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
