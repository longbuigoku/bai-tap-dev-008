import React, { useState } from 'react';
import { useStore } from '../store';
import type { Product } from '../types';

export const InventoryManager: React.FC = () => {
  const products = useStore((state) => state.products);
  const restockProduct = useStore((state) => state.restockProduct);
  const decreaseStock = useStore((state) => state.decreaseStock);
  const addNotification = useStore((state) => state.addNotification);

  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filtered = filterCategory === 'all'
    ? products
    : products.filter((p) => p.category === filterCategory);

  const handleRestock = (product: Product, amount: number) => {
    restockProduct(product.id, amount);
    addNotification({
      title: 'Nhập kho thành công',
      message: `Đã bổ sung +${amount} sản phẩm "${product.name}".`,
      type: 'system',
    });
  };

  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  return (
    <div className="inventory-section">
      <div className="section-header-box">
        <div>
          <h2>Quản Lý Tồn Kho Thực Tế</h2>
          <p className="section-desc">
            Dữ liệu tồn kho được lưu trữ trong Zustand <code>productsSlice</code> và tự động đồng bộ qua middleware <code>persist</code>.
          </p>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            {['all', 'laptop', 'phone', 'audio', 'accessory'].map((cat) => (
              <button
                key={cat}
                className={`cat-pill ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="stats-badges">
          <div className="stat-card">
            <span className="stat-num">{products.length}</span>
            <span className="stat-label">Mặt hàng</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{totalStockUnits}</span>
            <span className="stat-label">Tổng tồn kho</span>
          </div>
          <div className="stat-card warning">
            <span className="stat-num">{lowStockCount}</span>
            <span className="stat-label">Sắp hết hàng (&lt;10)</span>
          </div>
        </div>
      </div>

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Danh mục</th>
              <th>Đơn giá</th>
              <th>Tồn kho</th>
              <th>Tình trạng</th>
              <th>Hành động nhanh</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const isLow = product.stock > 0 && product.stock < 10;
              const isOut = product.stock === 0;

              return (
                <tr key={product.id}>
                  <td>
                    <div className="inv-product-cell">
                      <img src={product.image} alt={product.name} className="inv-thumb" />
                      <div>
                        <strong>{product.name}</strong>
                        <div className="inv-sku">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="tag-category">{product.category}</span>
                  </td>
                  <td>${product.price.toLocaleString()}</td>
                  <td>
                    <span className="stock-count-number">{product.stock}</span>
                  </td>
                  <td>
                    {isOut ? (
                      <span className="status-badge danger">Hết hàng</span>
                    ) : isLow ? (
                      <span className="status-badge warning">Cảnh báo thiếu</span>
                    ) : (
                      <span className="status-badge success">Dồi dào</span>
                    )}
                  </td>
                  <td>
                    <div className="quick-actions">
                      <button
                        className="btn-sm btn-outline"
                        onClick={() => handleRestock(product, 5)}
                        title="Bổ sung 5 đơn vị"
                      >
                        +5
                      </button>
                      <button
                        className="btn-sm btn-primary-sm"
                        onClick={() => handleRestock(product, 20)}
                        title="Bổ sung 20 đơn vị"
                      >
                        +20
                      </button>
                      <button
                        className="btn-sm btn-outline-danger"
                        disabled={product.stock <= 0}
                        onClick={() => decreaseStock(product.id, 1)}
                        title="Xuất kho thủ công 1 đơn vị"
                      >
                        -1
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
