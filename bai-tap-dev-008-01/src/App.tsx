import React, { useEffect } from 'react';
import { useStore } from './store';
import { Header } from './components/Header';
import { ProductCatalog } from './components/ProductCatalog';
import { InventoryManager } from './components/InventoryManager';
import { StoreArchitectureView } from './components/StoreArchitectureView';
import { CartDrawer } from './components/CartDrawer';
import './App.css';

export const App: React.FC = () => {
  const theme = useStore((state) => state.theme);
  const activeTab = useStore((state) => state.activeTab);

  // Áp dụng data-theme lên thẻ document root để chuyển đổi Dark / Light mode linh hoạt
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app-container">
      {/* Thanh điều hướng toàn cục */}
      <Header />

      {/* Khu vực nội dung theo tab được quản lý trong UserSlice */}
      <main className="main-content fade-in">
        {activeTab === 'catalog' && <ProductCatalog />}
        {activeTab === 'inventory' && <InventoryManager />}
        {activeTab === 'settings' && <StoreArchitectureView />}
      </main>

      {/* Giỏ hàng drawer pop-up quản lý trong CartSlice */}
      <CartDrawer />

      {/* Footer */}
      <footer className="app-footer">
        <p>
          🚀 <strong>Zustand State Architecture Demo</strong> — Store quản lý dữ liệu thực tế (Catalog, Inventory, Cart, Settings) tích hợp Slice Pattern và Middleware Persist.
        </p>
      </footer>
    </div>
  );
};

export default App;
