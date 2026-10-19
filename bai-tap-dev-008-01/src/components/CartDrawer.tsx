import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  ShoppingBagIcon, 
  TrashIcon, 
  PlusIcon, 
  MinusIcon, 
  CheckCircleIcon 
} from './Icons';

export const CartDrawer: React.FC = () => {
  const isCartOpen = useStore((state) => state.isCartOpen);
  const setCartOpen = useStore((state) => state.setCartOpen);
  const cart = useStore((state) => state.cart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);
  const restockProduct = useStore((state) => state.restockProduct);
  const getCartTotal = useStore((state) => state.getCartTotal);
  const addNotification = useStore((state) => state.addNotification);
  const user = useStore((state) => state.user);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isCartOpen) return null;

  const total = getCartTotal();
  const tax = total * 0.08;
  const grandTotal = total + tax;

  const formatPrice = (price: number) => {
    if (user.currency === 'VND') {
      return (price * 25400).toLocaleString('vi-VN') + ' ₫';
    }
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const handleIncrease = (productId: string, currentQty: number) => {
    updateQuantity(productId, currentQty + 1);
  };

  const handleDecrease = (productId: string, currentQty: number) => {
    if (currentQty === 1) {
      removeFromCart(productId);
      restockProduct(productId, 1);
    } else {
      updateQuantity(productId, currentQty - 1);
      restockProduct(productId, 1);
    }
  };

  const handleRemove = (productId: string, quantity: number) => {
    removeFromCart(productId);
    restockProduct(productId, quantity);
    addNotification({
      title: 'Đã xoá sản phẩm',
      message: 'Sản phẩm đã được hoàn trả lại số lượng tồn kho.',
      type: 'order',
    });
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      clearCart();
      addNotification({
        title: 'Đặt hàng thành công!',
        message: `Đơn hàng trị giá ${formatPrice(grandTotal)} đã được thanh toán và lưu vào trạng thái persist.`,
        type: 'order',
      });
      setTimeout(() => {
        setCheckoutSuccess(false);
        setCartOpen(false);
      }, 2500);
    }, 1200);
  };

  return (
    <div className="cart-overlay" onClick={() => setCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-title-row">
            <ShoppingBagIcon size={22} className="text-accent" />
            <h2>Giỏ Hàng Của Bạn</h2>
          </div>
          <button className="close-btn" onClick={() => setCartOpen(false)}>
            ✕
          </button>
        </div>

        {/* Success Banner */}
        {checkoutSuccess && (
          <div className="checkout-success-banner">
            <CheckCircleIcon size={24} className="text-success" />
            <div>
              <strong>Thanh toán thành công!</strong>
              <p>Store đã cập nhật và đồng bộ với localStorage.</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty-view">
              <div className="empty-cart-icon">🛒</div>
              <h3>Giỏ hàng đang trống</h3>
              <p>Hãy chọn mua một số sản phẩm công nghệ từ cửa hàng.</p>
              <button 
                className="btn-primary" 
                onClick={() => setCartOpen(false)}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.product.id} className="cart-item-card">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.product.name}</h4>
                    <span className="cart-item-unit-price">
                      {formatPrice(item.product.price)}
                    </span>

                    <div className="qty-control-row">
                      <div className="qty-stepper">
                        <button
                          className="qty-btn"
                          onClick={() => handleDecrease(item.product.id, item.quantity)}
                        >
                          <MinusIcon size={14} />
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => handleIncrease(item.product.id, item.quantity)}
                        >
                          <PlusIcon size={14} />
                        </button>
                      </div>

                      <button
                        className="remove-item-btn"
                        onClick={() => handleRemove(item.product.id, item.quantity)}
                        title="Xoá khỏi giỏ"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-subtotal">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-line">
              <span>Tạm tính:</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="cart-summary-line">
              <span>Thuế ước tính (8%):</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="cart-summary-line total-line">
              <span>Tổng thanh toán:</span>
              <span className="grand-total">{formatPrice(grandTotal)}</span>
            </div>

            <button
              className={`checkout-btn ${isCheckingOut ? 'loading' : ''}`}
              disabled={isCheckingOut}
              onClick={handleCheckout}
            >
              {isCheckingOut ? 'Đang Xử Lý Thanh Toán...' : 'Tiến Hành Đặt Hàng'}
            </button>

            <button className="clear-cart-text-btn" onClick={clearCart}>
              Xoá toàn bộ giỏ hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
