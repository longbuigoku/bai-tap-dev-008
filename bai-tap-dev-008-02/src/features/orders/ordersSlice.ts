import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Order, OrderStatus, OrdersFilter } from '../../types/order';
import { INITIAL_ORDERS } from '../../data/mockOrders';
import type { RootState } from '../../store';

export interface OrdersState {
  items: Order[];
  filter: OrdersFilter;
  selectedOrderId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastUpdated: string | null;
}

const initialState: OrdersState = {
  items: INITIAL_ORDERS,
  filter: {
    searchQuery: '',
    status: 'all',
    sortBy: 'createdAt-desc',
  },
  selectedOrderId: null,
  status: 'idle',
  error: null,
  lastUpdated: new Date().toISOString(),
};

// 1. Async Thunk mô phỏng gọi API fetch đơn hàng từ Server
export const fetchOrdersAsync = createAsyncThunk<Order[], void, { rejectValue: string }>(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      // Giả lập network delay 800ms
      await new Promise((resolve) => setTimeout(resolve, 800));
      return INITIAL_ORDERS;
    } catch {
      return rejectWithValue('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
    }
  }
);

// 2. Async Thunk cập nhật trạng thái đơn hàng có validate & delay mô phỏng
export const updateOrderStatusAsync = createAsyncThunk<
  { orderId: string; newStatus: OrderStatus },
  { orderId: string; newStatus: OrderStatus },
  { rejectValue: string }
>(
  'orders/updateStatusAsync',
  async ({ orderId, newStatus }, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return { orderId, newStatus };
    } catch {
      return rejectWithValue('Cập nhật trạng thái đơn hàng thất bại.');
    }
  }
);

// 3. Slice RTK hoàn chỉnh
export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Reducer tạo đơn hàng mới (Immer tự động handle immutable update)
    addOrder: (state, action: PayloadAction<Omit<Order, 'id' | 'createdAt'>>) => {
      const newOrder: Order = {
        ...action.payload,
        id: `ord-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newOrder);
      state.lastUpdated = new Date().toISOString();
    },

    // Xoá hoặc huỷ đơn hàng
    cancelOrder: (state, action: PayloadAction<string>) => {
      const order = state.items.find((item) => item.id === action.payload);
      if (order) {
        order.status = 'cancelled';
        state.lastUpdated = new Date().toISOString();
      }
    },

    // Cập nhật bộ lọc tìm kiếm & trạng thái
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filter.searchQuery = action.payload;
    },

    setStatusFilter: (state, action: PayloadAction<OrderStatus | 'all'>) => {
      state.filter.status = action.payload;
    },

    setSortBy: (
      state,
      action: PayloadAction<OrdersFilter['sortBy']>
    ) => {
      state.filter.sortBy = action.payload;
    },

    setSelectedOrder: (state, action: PayloadAction<string | null>) => {
      state.selectedOrderId = action.payload;
    },

    // Reset toàn bộ danh sách đơn hàng về mặc định
    resetOrders: (state) => {
      state.items = INITIAL_ORDERS;
      state.filter = {
        searchQuery: '',
        status: 'all',
        sortBy: 'createdAt-desc',
      };
      state.selectedOrderId = null;
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    // Handling async thunk lifecycle
    builder
      // fetchOrdersAsync
      .addCase(fetchOrdersAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrdersAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchOrdersAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Đã có lỗi xảy ra';
      })
      // updateOrderStatusAsync
      .addCase(updateOrderStatusAsync.fulfilled, (state, action) => {
        const order = state.items.find((item) => item.id === action.payload.orderId);
        if (order) {
          order.status = action.payload.newStatus;
          state.lastUpdated = new Date().toISOString();
        }
      });
  },
});

// Action creators được sinh tự động
export const {
  addOrder,
  cancelOrder,
  setSearchQuery,
  setStatusFilter,
  setSortBy,
  setSelectedOrder,
  resetOrders,
} = ordersSlice.actions;

// 4. Memoized Selectors (sử dụng createSelector để tối ưu hiệu năng render)
export const selectAllOrders = (state: RootState): Order[] => state.orders.items;
export const selectOrdersFilter = (state: RootState): OrdersFilter => state.orders.filter;
export const selectOrdersLoadingStatus = (state: RootState) => state.orders.status;
export const selectSelectedOrderId = (state: RootState) => state.orders.selectedOrderId;

// Selector tính toán đơn hàng lọc và sắp xếp
export const selectFilteredOrders = createSelector(
  [selectAllOrders, selectOrdersFilter],
  (orders: Order[], filter: OrdersFilter): Order[] => {
    const result = orders.filter((order: Order) => {
      const matchStatus =
        filter.status === 'all' || order.status === filter.status;
      const search = filter.searchQuery.toLowerCase();
      const matchSearch =
        order.orderNumber.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search) ||
        order.customerEmail.toLowerCase().includes(search);
      return matchStatus && matchSearch;
    });

    return [...result].sort((a: Order, b: Order) => {
      if (filter.sortBy === 'createdAt-desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (filter.sortBy === 'createdAt-asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (filter.sortBy === 'totalAmount-desc') {
        return b.totalAmount - a.totalAmount;
      }
      return a.totalAmount - b.totalAmount;
    });
  }
);

// Selector tính toán thống kê KPI (Revenue, Counts)
export const selectOrdersKPI = createSelector([selectAllOrders], (orders: Order[]) => {
  const totalRevenue = orders
    .filter((o: Order) => o.status !== 'cancelled')
    .reduce((sum: number, o: Order) => sum + o.totalAmount, 0);

  const pendingCount = orders.filter((o: Order) => o.status === 'pending').length;
  const processingCount = orders.filter((o: Order) => o.status === 'processing').length;
  const shippedCount = orders.filter((o: Order) => o.status === 'shipped').length;
  const deliveredCount = orders.filter((o: Order) => o.status === 'delivered').length;
  const cancelledCount = orders.filter((o: Order) => o.status === 'cancelled').length;

  return {
    totalRevenue,
    totalCount: orders.length,
    pendingCount,
    processingCount,
    shippedCount,
    deliveredCount,
    cancelledCount,
  };
});

export default ordersSlice.reducer;
