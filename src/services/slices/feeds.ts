import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

export type TFeedsState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

export const initialState: TFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk(
  'feeds/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'feeds/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders[0];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : action.error?.message || 'Unknown error';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : action.error?.message || 'Unknown error';
      });
  },
  selectors: {
    selectFeeds: (state: TFeedsState) => state,
    selectOrders: (state: TFeedsState) => state.orders,
    selectTotal: (state: TFeedsState) => state.total,
    selectTotalToday: (state: TFeedsState) => state.totalToday,
    selectIsLoading: (state: TFeedsState) => state.isLoading,
    selectError: (state: TFeedsState) => state.error,
    selectDoneOrders: (state: TFeedsState) =>
      state.orders
        .filter((item) => item.status === 'done')
        .map((item) => item.number)
        .slice(0, 20),
    selectPendingOrders: (state: TFeedsState) =>
      state.orders
        .filter((item) => item.status === 'pending')
        .map((item) => item.number)
        .slice(0, 20)
  }
});

export const {
  selectFeeds,
  selectOrders,
  selectTotal,
  selectTotalToday,
  selectIsLoading,
  selectError,
  selectDoneOrders,
  selectPendingOrders
} = feedsSlice.selectors;

export const feedsReducer = feedsSlice.reducer;
