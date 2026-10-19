import React from 'react';

export const StoreArchitectureDoc: React.FC = () => {
  return (
    <div className="doc-container">
      {/* 1. Giải thích lý do chọn công cụ cho dự án giả định */}
      <section className="doc-section">
        <div className="section-badge">Phần 1: Lựa Chọn Công Cụ</div>
        <h2 className="section-title">
          Bối Cảnh Dự Án Giả Định & Lý Do Chọn Redux Toolkit (RTK)
        </h2>
        <div className="doc-card">
          <div className="project-scenario">
            <h3>Dự án giả định: Hệ thống Quản trị Thương mại Điện tử Đa chi nhánh (Enterprise E-Commerce Admin Hub)</h3>
            <p>
              Hệ thống quản lý chuỗi cung ứng, đơn hàng đa kênh, tồn kho thời gian thực, quản lý phân quyền và kiểm toán tài chính (audit logs). Dự án có hơn 15 kỹ sư tham gia và xử lý luồng dữ liệu phức tạp.
            </p>
          </div>

          <div className="reasons-grid">
            <div className="reason-item">
              <div className="reason-icon">🛡️</div>
              <div>
                <h4>1. Khắt khe về Single Source of Truth & Dự đoán được (Predictability)</h4>
                <p>
                  Mọi biến động dữ liệu quan trọng (thay đổi trạng thái đơn, điều chỉnh giá, huỷ giao dịch) phải thông qua luồng Action Dispatch rõ ràng, tránh side-effects ngầm hoặc mutate lung tung.
                </p>
              </div>
            </div>

            <div className="reason-item">
              <div className="reason-icon">🔍</div>
              <div>
                <h4>2. Khả năng gỡ lỗi đỉnh cao với Redux DevTools (Time-travel Debugging)</h4>
                <p>
                  Khi có lỗi giao dịch phát sinh từ khách hàng hoặc kho, đội ngũ QA và Dev có thể inspect từng action payload, tua ngược trạng thái (replay) để tìm ra nguồn gốc lỗi chính xác 100%.
                </p>
              </div>
            </div>

            <div className="reason-item">
              <div className="reason-icon">⚡</div>
              <div>
                <h4>3. Tích hợp sẵn Immer & createSelector (Tối ưu hiệu năng)</h4>
                <p>
                  RTK tích hợp ngầm Immer giúp viết cú pháp "mutable" an toàn mà không sợ mutate state gốc. Kết hợp <code>createSelector</code> của Reselect giúp memoize tính toán KPI (doanh thu, thống kê) chỉ re-compute khi dependencies thay đổi.
                </p>
              </div>
            </div>

            <div className="reason-item">
              <div className="reason-icon">👥</div>
              <div>
                <h4>4. Chuẩn hoá kiến trúc cho đội ngũ lớn (Team Scalability)</h4>
                <p>
                  Quy chuẩn tổ chức code theo "Ducks / Feature-based module" giúp chia nhỏ tính năng (Orders, Inventory, Auth, Analytics). Thành viên mới dễ dàng onboarding theo form chuẩn của Redux Style Guide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Phác thảo kiến trúc store theo module */}
      <section className="doc-section">
        <div className="section-badge">Phần 2: Kiến Trúc Store Module</div>
        <h2 className="section-title">
          Phác Thảo Kiến Trúc Store Theo Module (Feature-First Architecture)
        </h2>

        <div className="arch-layout-grid">
          <div className="code-tree-box">
            <h4>Cây thư mục chuẩn Feature-Based (RTK standard)</h4>
            <pre className="tree-code">
{`src/
├── app/ (hoặc store/)
│   ├── index.ts               # configureStore() & RootState/AppDispatch
│   ├── rootReducer.ts         # Hợp nhất reducers các module
│   └── hooks.ts               # useAppDispatch & useAppSelector typed
│
├── features/                  # Phân rã theo nghiệp vụ (Domain-Driven)
│   ├── orders/                # Module Quản lý Đơn hàng
│   │   ├── ordersSlice.ts     # actions, reducers, thunks, selectors
│   │   ├── ordersAPI.ts       # Service gọi API riêng biệt
│   │   ├── OrdersDashboard.tsx# UI Component
│   │   └── types.ts           # Types nội bộ của orders
│   │
│   ├── products/              # Module Sản phẩm & Tồn kho
│   │   ├── productsSlice.ts
│   │   └── productsAPI.ts
│   │
│   ├── auth/                  # Module Xác thực & Phân quyền
│   │   └── authSlice.ts
│   │
│   └── ui/                    # Module Trạng thái giao diện
│       └── uiSlice.ts         # Theme, sidebar, notification toasts
│
└── shared/                    # Components & Utils dùng chung`}
            </pre>
          </div>

          <div className="module-flow-box">
            <h4>Quy trình luân chuyển dữ liệu Module</h4>
            <div className="flow-step">
              <span className="step-num">1</span>
              <div>
                <strong>UI Dispatch:</strong> Component bắn Typed Action (ví dụ: <code>updateOrderStatusAsync</code>)
              </div>
            </div>
            <div className="flow-step">
              <span className="step-num">2</span>
              <div>
                <strong>Middleware Pipeline:</strong> RTK Thunk xử lý async API, Redux DevTools ghi nhận Action Log.
              </div>
            </div>
            <div className="flow-step">
              <span className="step-num">3</span>
              <div>
                <strong>Slice Reducer:</strong> Immer cập nhật draft state an toàn trong module tương ứng.
              </div>
            </div>
            <div className="flow-step">
              <span className="step-num">4</span>
              <div>
                <strong>Memoized Reselect:</strong> <code>createSelector</code> lọc dữ liệu và thông báo re-render cho các component đăng ký.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. So sánh tương quan RTK vs Zustand */}
      <section className="doc-section">
        <div className="section-badge">Phần 3: Đối Chiếu Trực Quan</div>
        <h2 className="section-title">So Sánh Redux Toolkit & Zustand</h2>
        <div className="table-responsive">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Tiêu chí</th>
                <th>Redux Toolkit (RTK)</th>
                <th>Zustand</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Quy mô phù hợp</strong></td>
                <td>Dự án vừa đến rất lớn (Enterprise), nhiều module & team đông</td>
                <td>Dự án nhỏ đến vừa, micro-frontends, yêu cầu tốc độ phát triển cao</td>
              </tr>
              <tr>
                <td><strong>Boilerplate</strong></td>
                <td>Trung bình (đã giảm nhiều so với Redux cũ nhờ createSlice)</td>
                <td>Cực kỳ ít, định nghĩa store chỉ trong 1 function <code>create()</code></td>
              </tr>
              <tr>
                <td><strong>DevTools & Debugging</strong></td>
                <td>Rất mạnh (Action history, Time-travel, Replay state)</td>
                <td>Có middleware Redux DevTools cơ bản nhưng đơn giản hơn</td>
              </tr>
              <tr>
                <td><strong>Học & Onboarding</strong></td>
                <td>Cần hiểu Dispatch, Action, Reducer, Selector, Thunk</td>
                <td>Rất nhanh, tư duy hook React thuần tuý</td>
              </tr>
              <tr>
                <td><strong>Mô hình Slice</strong></td>
                <td>Module độc lập ghép tại configureStore: {`{ reducer }`}</td>
                <td>Gộp các slice creators vào 1 single hook qua spread syntax</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
