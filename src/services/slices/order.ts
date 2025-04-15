import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi, orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

export type TOrderState = {
  orders: TOrder[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

export const initialState: TOrderState = {
  orders: [],
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response.order;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders[0]; // Возвращаем первый заказ из массива
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
      state.error = null;
    },
    setOrderModalData: (state, action) => {
      state.orderModalData = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      });
  }
});

export const { closeOrderModal, setOrderModalData } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;

// Селекторы
export const getOrders = (state: { order: TOrderState }) => state.order.orders;
export const getOrderModalData = (state: { order: TOrderState }) =>
  state.order.orderModalData;
