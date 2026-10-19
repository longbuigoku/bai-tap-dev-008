import React, { useState } from 'react';
import { useStore } from '../store';
import { DatabaseIcon, RefreshCwIcon, CheckCircleIcon } from './Icons';

export const StoreArchitectureView: React.FC = () => {
  const user = useStore((state) => state.user);
  const updateUser = useStore((state) => state.updateUser);
  const addNotification = useStore((state) => state.addNotification);

  const [copied, setCopied] = useState(false);

  // Lấy dữ liệu thực tế đang lưu trong LocalStorage
  const rawLocalStorage = typeof window !== 'undefined' 
    ? localStorage.getItem('app-ecommerce-zustand-store') 
    : '';

  const parsedStorage = rawLocalStorage ? JSON.parse(rawLocalStorage) : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(parsedStorage, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetStore = () => {
    if (confirm('Bạn có chắc chắn muốn xóa cache localStorage và tải lại mặc định?')) {
      localStorage.removeItem('app-ecommerce-zustand-store');
      window.location.reload();
    }
  };

  return (
    <div className="arch-container">
      <div className="section-header-box">
        <div>
          <h2>Kiến Trúc Multi-Slice & Persist Trong Zustand</h2>
          <p className="section-desc">
            Khảo sát cơ chế phân rã Slice pattern (Slice Creators) và phân tích các trường được <code>partialize</code> vào LocalStorage.
          </p>
        </div>
        <div className="action-row">
          <button className="btn-secondary" onClick={handleResetStore}>
            <RefreshCwIcon size={16} />
            <span>Reset LocalStorage</span>
          </button>
        </div>
      </div>

      {/* Slice Breakdown Diagram */}
      <div className="slice-cards-grid">
        <div className="slice-card">
          <div className="slice-card-header">
            <span className="slice-tag tag-blue">Slice 1</span>
            <h3>productsSlice.ts</h3>
          </div>
          <p className="slice-desc">
            Quản lý danh sách sản phẩm, danh mục hiện tại, tìm kiếm, sắp xếp và số lượng hàng tồn.
          </p>
          <ul className="slice-keys-list">
            <li><code>products: Product[]</code></li>
            <li><code>selectedCategory: string</code></li>
            <li><code>searchQuery: string</code></li>
            <li><code>sortBy: string</code></li>
            <li><code>decreaseStock(), restockProduct()</code></li>
          </ul>
        </div>

        <div className="slice-card">
          <div className="slice-card-header">
            <span className="slice-tag tag-purple">Slice 2</span>
            <h3>cartSlice.ts</h3>
          </div>
          <p className="slice-desc">
            Xử lý giỏ hàng, thêm/sửa/xoá, số lượng sản phẩm và các computed getters tính tổng tiền.
          </p>
          <ul className="slice-keys-list">
            <li><code>cart: CartItem[]</code></li>
            <li><code>addToCart(product, qty)</code></li>
            <li><code>removeFromCart(productId)</code></li>
            <li><code>updateQuantity(productId, qty)</code></li>
            <li><code>getCartTotal(), getCartCount()</code></li>
          </ul>
        </div>

        <div className="slice-card">
          <div className="slice-card-header">
            <span className="slice-tag tag-emerald">Slice 3</span>
            <h3>userSlice.ts</h3>
          </div>
          <p className="slice-desc">
            Thông tin người dùng, đơn vị tiền tệ hiển thị, thông báo và trạng thái giao diện UI.
          </p>
          <ul className="slice-keys-list">
            <li><code>user: UserProfile</code></li>
            <li><code>notifications: NotificationItem[]</code></li>
            <li><code>theme: 'dark' | 'light'</code></li>
            <li><code>isCartOpen: boolean</code></li>
            <li><code>toggleTheme(), updateUser()</code></li>
          </ul>
        </div>
      </div>

      {/* Live Store Config & User Patching */}
      <div className="user-config-card">
        <h3>Điều chỉnh thông tin người dùng (Kiểm chứng Persist)</h3>
        <p className="muted-text">
          Thay đổi các giá trị bên dưới và thử <strong>F5 tải lại trang</strong>. Dữ liệu sẽ lập tức được phục hồi từ LocalStorage nhờ middleware <code>persist</code>.
        </p>

        <div className="config-form-grid">
          <div className="form-group">
            <label>Tên hiển thị:</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => updateUser({ name: e.target.value })}
              className="config-input"
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="text"
              value={user.email}
              onChange={(e) => updateUser({ email: e.target.value })}
              className="config-input"
            />
          </div>

          <div className="form-group">
            <label>Đơn vị tiền tệ hiển thị:</label>
            <select
              value={user.currency}
              onChange={(e) => {
                const currency = e.target.value as 'USD' | 'VND';
                updateUser({ currency });
                addNotification({
                  title: 'Đổi đơn vị tiền tệ',
                  message: `Đã đổi đơn vị hiển thị thành ${currency}`,
                  type: 'system',
                });
              }}
              className="config-select"
            >
              <option value="USD">USD ($) - Đô la Mỹ</option>
              <option value="VND">VND (₫) - Việt Nam Đồng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Real-time LocalStorage Inspector */}
      <div className="localstorage-inspector">
        <div className="inspector-header">
          <div className="inspector-title">
            <DatabaseIcon size={18} />
            <h4>Dữ liệu thực tế trong LocalStorage: <code>app-ecommerce-zustand-store</code></h4>
          </div>
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? <CheckCircleIcon size={16} /> : null}
            <span>{copied ? 'Đã sao chép' : 'Sao chép JSON'}</span>
          </button>
        </div>
        <div className="json-container">
          <pre className="json-code">
            {parsedStorage ? JSON.stringify(parsedStorage, null, 2) : 'Đang tải dữ liệu...'}
          </pre>
        </div>
      </div>
    </div>
  );
};
