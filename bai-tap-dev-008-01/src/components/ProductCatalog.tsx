import React from 'react';
import { useStore } from '../store';
import type { Product } from '../types';
import { StarIcon, PlusIcon } from './Icons';

export const ProductCatalog: React.FC = () => {
  const products = useStore((state) => state.products);
  const selectedCategory = useStore((state) => state.selectedCategory);
  const setCategory = useStore((state) => state.setCategory);
  const searchQuery = useStore((state) => state.searchQuery);
  const sortBy = useStore((state) => state.sortBy);
  const setSortBy = useStore((state) => state.setSortBy);
  const addToCart = useStore((state) => state.addToCart);
  const decreaseStock = useStore((state) => state.decreaseStock);
  const addNotification = useStore((state) => state.addNotification);
  const user = useStore((state) => state.user);

  // Filter & Sort Logic
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  filteredProducts.sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return a.name.localeCompare(b.name);
  });

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) return;
    
    // Dispatch action từ CartSlice
    addToCart(product, 1);
    // Dispatch action từ ProductsSlice
    decreaseStock(product.id, 1);
    // Dispatch action từ UserSlice
    addNotification({
      title: 'Đã thêm vào giỏ',
      message: `Đã thêm 1x "${product.name}" vào giỏ hàng thành công.`,
      type: 'order',
    });
  };

  const categories = [
    { id: 'all', label: 'Tất Cả' },
    { id: 'laptop', label: '💻 Laptop' },
    { id: 'phone', label: '📱 Điện Thoại' },
    { id: 'audio', label: '🎧 Âm Thanh' },
    { id: 'accessory', label: '⌚ Phụ Kiện' },
  ];

  const formatPrice = (price: number) => {
    if (user.currency === 'VND') {
      return (price * 25400).toLocaleString('vi-VN') + ' ₫';
    }
    return `$${price.toLocaleString('en-US')}`;
  };

  return (
    <section className="catalog-section">
      {/* Category Pills & Sort Bar */}
      <div className="filter-bar">
        <div className="category-group">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="sort-group">
          <label htmlFor="sort-select" className="sort-label">Sắp xếp:</label>
          <select
            id="sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="rating">Đánh giá cao nhất</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="name">Tên sản phẩm (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Product List Grid */}
      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">Không tìm thấy sản phẩm nào</p>
            <p className="empty-subtitle">Thử tìm kiếm với từ khoá khác hoặc chọn lại phân loại.</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isOutOfStock = product.stock <= 0;
            return (
              <div key={product.id} className="product-card">
                <div className="product-img-wrapper">
                  <img src={product.image} alt={product.name} className="product-img" loading="lazy" />
                  <span className="category-badge">{product.category.toUpperCase()}</span>
                  <div className="rating-pill">
                    <StarIcon size={14} className="star-icon" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                <div className="product-content">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>

                  <div className="product-meta">
                    <div className="stock-info">
                      {isOutOfStock ? (
                        <span className="stock-out">Hết hàng</span>
                      ) : (
                        <span className="stock-in">Còn {product.stock} trong kho</span>
                      )}
                    </div>
                    <div className="price-tag">{formatPrice(product.price)}</div>
                  </div>

                  <button
                    className={`add-btn ${isOutOfStock ? 'disabled' : ''}`}
                    disabled={isOutOfStock}
                    onClick={() => handleAddToCart(product)}
                  >
                    <PlusIcon size={18} />
                    <span>{isOutOfStock ? 'Tạm Hết Hàng' : 'Thêm Vào Giỏ'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
