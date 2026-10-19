import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  selectFilteredOrders,
  selectOrdersKPI,
  selectOrdersFilter,
  selectOrdersLoadingStatus,
  setSearchQuery,
  setStatusFilter,
  setSortBy,
  updateOrderStatusAsync,
  cancelOrder,
  fetchOrdersAsync,
  addOrder,
  resetOrders,
} from './ordersSlice';
import { setNotification } from '../ui/uiSlice';
import type { OrderStatus, OrderItem, Order } from '../../types/order';

export const OrdersDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const filteredOrders = useAppSelector(selectFilteredOrders);
  const kpi = useAppSelector(selectOrdersKPI);
  const filter = useAppSelector(selectOrdersFilter);
  const loadingStatus = useAppSelector(selectOrdersLoadingStatus);

  // Local modal state for creating quick new order
  const [showAddModal, setShowAddModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [productName, setProductName] = useState('MacBook Air M3');
  const [unitPrice, setUnitPrice] = useState(1099);
  const [quantity, setQuantity] = useState(1);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    dispatch(updateOrderStatusAsync({ orderId, newStatus }));
    dispatch(
      setNotification({
        message: `Đơn hàng #${orderId} được chuyển sang trạng thái "${newStatus}".`,
        type: 'success',
      })
    );
  };

  const handleCancel = (orderId: string) => {
    dispatch(cancelOrder(orderId));
    dispatch(
      setNotification({
        message: `Đơn hàng #${orderId} đã bị huỷ.`,
        type: 'warning',
      })
    );
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail) return;

    dispatch(
      addOrder({
        orderNumber: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName,
        customerEmail,
        shippingAddress: shippingAddress || 'TP. Hồ Chí Minh, Việt Nam',
        items: [
          {
            productId: `prod-${Date.now()}`,
            productName,
            unitPrice,
            quantity,
            image:
              'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80',
          },
        ],
        totalAmount: unitPrice * quantity,
        status: 'pending',
      })
    );

    dispatch(
      setNotification({
        message: `Tạo mới đơn hàng cho khách hàng ${customerName} thành công!`,
        type: 'success',
      })
    );

    setShowAddModal(false);
    setCustomerName('');
    setCustomerEmail('');
    setShippingAddress('');
  };

  const statusColors: Record<OrderStatus, string> = {
    pending: 'badge-pending',
    processing: 'badge-processing',
    shipped: 'badge-shipped',
    delivered: 'badge-delivered',
    cancelled: 'badge-cancelled',
  };

  return (
    <div className="orders-container">
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Tổng Doanh Thu Hợp Lệ</div>
          <div className="kpi-value text-accent">
            ${kpi.totalRevenue.toLocaleString()}
          </div>
          <div className="kpi-sub">Loại trừ các đơn đã huỷ</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Tổng Số Đơn Hàng</div>
          <div className="kpi-value">{kpi.totalCount}</div>
          <div className="kpi-sub">
            {kpi.deliveredCount} đã giao thành công
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Đang Xử Lý / Giao</div>
          <div className="kpi-value text-warning">
            {kpi.processingCount + kpi.shippedCount}
          </div>
          <div className="kpi-sub">{kpi.pendingCount} đơn chờ duyệt</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Đơn Bị Huỷ</div>
          <div className="kpi-value text-danger">{kpi.cancelledCount}</div>
          <div className="kpi-sub">Tỉ lệ huỷ thấp</div>
        </div>
      </div>

      {/* Control Bar: Filters & Actions */}
      <div className="control-bar">
        <div className="search-wrap">
          <input
            type="text"
            placeholder="Tìm theo mã đơn, tên hoặc email khách hàng..."
            value={filter.searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="input-search"
          />
        </div>

        <div className="filter-actions-wrap">
          {/* Status Filter */}
          <select
            value={filter.status}
            onChange={(e) =>
              dispatch(setStatusFilter(e.target.value as OrderStatus | 'all'))
            }
            className="select-custom"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý (Pending)</option>
            <option value="processing">Đang đóng gói (Processing)</option>
            <option value="shipped">Đang giao hàng (Shipped)</option>
            <option value="delivered">Đã giao hàng (Delivered)</option>
            <option value="cancelled">Đã huỷ (Cancelled)</option>
          </select>

          {/* Sort By */}
          <select
            value={filter.sortBy}
            onChange={(e) =>
              dispatch(setSortBy(e.target.value as any))
            }
            className="select-custom"
          >
            <option value="createdAt-desc">Mới nhất trước</option>
            <option value="createdAt-asc">Cũ nhất trước</option>
            <option value="totalAmount-desc">Giá trị cao nhất</option>
            <option value="totalAmount-asc">Giá trị thấp nhất</option>
          </select>

          {/* Async Thunk Refresh */}
          <button
            className="btn-outline"
            onClick={() => dispatch(fetchOrdersAsync())}
            title="Gọi createAsyncThunk mô phỏng gọi API"
          >
            {loadingStatus === 'loading' ? 'Đang tải...' : '🔄 Gọi Async Thunk'}
          </button>

          {/* Create Order Button */}
          <button
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Tạo Đơn Mới
          </button>

          <button
            className="btn-ghost"
            onClick={() => dispatch(resetOrders())}
            title="Khôi phục dữ liệu ban đầu"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-responsive">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã Đơn / Ngày Tạo</th>
              <th>Khách Hàng</th>
              <th>Sản Phẩm</th>
              <th>Tổng Tiền</th>
              <th>Trạng Thái</th>
              <th>Cập Nhật Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order: Order) => (
                <tr key={order.id}>
                  <td>
                    <div className="order-number">{order.orderNumber}</div>
                    <div className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td>
                    <div className="customer-name">{order.customerName}</div>
                    <div className="customer-email">{order.customerEmail}</div>
                  </td>
                  <td>
                    <div className="items-summary">
                      {order.items.map((i: OrderItem, idx: number) => (
                        <span key={idx} className="item-pill">
                          {i.quantity}x {i.productName}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <strong className="order-amount">
                      ${order.totalAmount.toLocaleString()}
                    </strong>
                  </td>
                  <td>
                    <span className={`status-pill ${statusColors[order.status]}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={order.status}
                      disabled={order.status === 'cancelled'}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    {order.status !== 'cancelled' && (
                      <button
                        className="btn-danger-sm"
                        onClick={() => handleCancel(order.id)}
                      >
                        Huỷ
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Order Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tạo Đơn Hàng Mới (Dispatch RTK Action)</h3>
              <button
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateOrder} className="modal-form">
              <div className="form-group">
                <label>Tên khách hàng *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lê Văn Nam"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email khách hàng *</label>
                <input
                  type="email"
                  required
                  placeholder="nam.le@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ giao hàng</label>
                <input
                  type="text"
                  placeholder="Số nhà, đường, quận/huyện..."
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                />
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label>Sản phẩm</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Đơn giá ($)</label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Số lượng</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setShowAddModal(false)}
                >
                  Huỷ bỏ
                </button>
                <button type="submit" className="btn-primary">
                  Xác nhận tạo đơn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
