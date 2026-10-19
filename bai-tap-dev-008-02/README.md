# Dự Án Redux Toolkit: Hệ Thống Quản Lý Đơn Hàng (RTK OrderHub)

Thư mục: `bai-tap-dev-008-02`

Dự án hoàn chỉnh đáp ứng trọn vẹn 3 yêu cầu cốt lõi về **Redux Toolkit**:
1. **Viết 1 slice RTK hoàn chỉnh** (`ordersSlice.ts`): Có đầy đủ State, Actions, Reducers, ExtraReducers (với `createAsyncThunk`), và Memoized Selectors (với `createSelector`).
2. **Giải thích lý do chọn công cụ cho dự án giả định**: Phân tích bối cảnh hệ thống E-Commerce đa kênh, audit log, time-travel debugging và team scale.
3. **Phác thảo kiến trúc store theo module**: Feature-first / Domain-Driven Architecture chuẩn mực của Redux Style Guide.

---

## 1. Viết 1 Slice RTK Hoàn Chỉnh (`ordersSlice.ts`)

Tệp mã nguồn: [`src/features/orders/ordersSlice.ts`](src/features/orders/ordersSlice.ts)

### Các thành phần chính trong Slice:
- **`initialState`**: Định nghĩa cấu trúc dữ liệu đơn hàng (`items`), bộ lọc (`filter`), trạng thái tải async (`status: 'idle' | 'loading' | 'succeeded' | 'failed'`), thông báo lỗi và timestamp.
- **`reducers` (Synchronous Actions)**:
  - `addOrder`: Thêm đơn hàng mới (tự động xử lý draft immutable qua Immer tích hợp sẵn trong RTK).
  - `cancelOrder`: Cập nhật trạng thái huỷ đơn.
  - `setSearchQuery`, `setStatusFilter`, `setSortBy`: Thay đổi điều kiện lọc và sắp xếp.
  - `resetOrders`: Khôi phục dữ liệu ban đầu.
- **`extraReducers` & `createAsyncThunk` (Asynchronous Actions)**:
  - `fetchOrdersAsync`: Giả lập gọi API server với pending, fulfilled, rejected.
  - `updateOrderStatusAsync`: Cập nhật trạng thái đơn hàng bất đồng bộ với validation và rollback nếu lỗi.
- **Memoized Selectors (`createSelector`)**:
  - `selectFilteredOrders`: Tính toán danh sách đơn đã qua lọc & sắp xếp, chỉ re-compute khi danh sách gốc hoặc bộ lọc thay đổi (tránh re-render thừa).
  - `selectOrdersKPI`: Tính tổng doanh thu hợp lệ, đếm số lượng đơn từng trạng thái (Pending, Processing, Shipped, Delivered, Cancelled).

---

## 2. Giải Thích Lý Do Chọn Redux Toolkit Cho Dự Án Giả Định

### Bối Cảnh Dự Án Giả Định
> **Enterprise E-Commerce Admin Hub (Hệ thống Quản trị Thương mại Điện tử Đa Chi Nhánh)**: Quản lý hàng trăm nghìn đơn hàng từ nhiều kênh (Website, Shopee, Lazada, TikTok Shop), kết nối hệ thống kho hàng và kiểm toán giao dịch (Audit Logs) với hơn 15 kỹ sư cùng phát triển.

### 4 Lý Do Chính Chọn Redux Toolkit:
1. **Single Source of Truth & Tính Dự Đoán Được Tuyệt Đối (Predictability)**:
   - Mọi thay đổi dữ liệu (đổi trạng thái đơn, chiết khấu, huỷ thanh toán) đều phải thông qua một luồng **Action Dispatch** duy nhất. Không có việc component tự do mutate state, giúp code dễ trace và an toàn tuyệt đối.
2. **Khả Năng Debugging Vượt Trội Với Redux DevTools (Time-Travel Debugging)**:
   - Cho phép inspect từng Action, xem state diff trước/sau, tua ngược trạng thái (replay) để tái hiện chính xác lỗi người dùng gặp phải trên môi trường thực tế.
3. **Tích hợp sẵn Immer & createSelector (Hiệu năng cao)**:
   - Viết reducer dạng "mutable" tiện lợi nhưng dưới nền vẫn là immutable update.
   - Reselect (`createSelector`) giúp tính toán các chỉ số KPI phức tạp mà không tốn CPU tính lại mỗi lần giao diện re-render.
4. **Chuẩn Hoá Quy Trình Cho Đội Ngũ Lớn (Scalability & Standardized Convention)**:
   - Cung cấp sẵn các pattern chuẩn (createSlice, createAsyncThunk, configureStore) giúp các lập trình viên tuân theo một phong cách viết thống nhất, giảm thiểu tranh cãi về mặt cấu trúc.

---

## 3. Phác Kiến Trúc Store Theo Module (Feature-First Architecture)

Mô hình cấu trúc thư mục chuẩn mực được áp dụng:

```text
src/
├── store/                          # Cấu hình Store tập trung
│   └── index.ts                    # configureStore({ reducer }), typed hooks (useAppDispatch, useAppSelector)
│
├── features/                       # Phân rã theo Domain / Feature
│   ├── orders/                     # MODULE QUẢN LÝ ĐƠN HÀNG
│   │   ├── ordersSlice.ts          # State, actions, extraReducers, memoized selectors
│   │   └── OrdersDashboard.tsx     # Giao diện quản lý & KPI
│   │
│   ├── ui/                         # MODULE GIAO DIỆN & TIỆN ÍCH
│   │   └── uiSlice.ts              # Theme (dark/light), notifications toast, tabs
│   │
│   ├── products/ (mở rộng)         # MODULE SẢN PHẨM & TỒN KHO
│   └── auth/ (mở rộng)             # MODULE PHÂN QUYỀN & TÀI KHOẢN
│
├── types/                          # Type definitions dùng chung
│   └── order.ts
│
└── components/                     # Components dùng chung & tài liệu
    └── StoreArchitectureDoc.tsx
```

---

## 4. Hướng Dẫn Chạy Thử Dự Án

```bash
cd bai-tap-dev-008-02
npm install
npm run dev
```

Dự án gồm 2 tab tương tác trực quan:
- **Tab 1: 📦 Quản Lý Đơn Hàng (Slice)**: Test dispatch action thêm đơn hàng, cập nhật trạng thái đơn, lọc theo status/search, gọi `createAsyncThunk`, xem KPI tự tính toán qua `createSelector`.
- **Tab 2: 📐 Kiến Trúc Module & Biện Luận**: Hiển thị chi tiết bảng so sánh RTK vs Zustand, cây kiến trúc module và luồng dữ liệu chuẩn Enterprise.
