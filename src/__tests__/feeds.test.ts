import { expect, test, describe, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { feedsReducer, fetchFeeds, fetchOrderByNumber } from '../services/slices/feeds';
import { getFeedsApi, getOrderByNumberApi } from '../utils/burger-api';
import { TOrder } from '@utils-types';
import { TFeedsResponse } from '../utils/burger-api';

jest.mock('../utils/burger-api', () => ({
  getFeedsApi: jest.fn(),
  getOrderByNumberApi: jest.fn(),
}));

describe('feedsSlice/fetchFeeds', () => {
  const feedRespond: TFeedsResponse = {
    success: true,
    orders: [
      {
        _id: '67e311a56fce7d001db5c321',
        ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa0945'],
        status: 'done',
        name: 'Флюоресцентный антарианский бургер',
        createdAt: '2025-03-25T20:27:17.017Z',
        updatedAt: '2025-03-25T20:27:17.699Z',
        number: 72127,
      },
    ],
    total: 71753,
    totalToday: 63,
  };

  const store = configureStore({
    reducer: {
      feeds: feedsReducer,
    },
  });

  test('should set isLoading to true on pending', async () => {
    store.dispatch(fetchFeeds.pending('', undefined));

    expect(store.getState().feeds.isLoading).toBe(true);
    expect(store.getState().feeds.error).toBe(null);
  });

  test('should set data and request states correctly on fulfilled', async () => {
    (getFeedsApi as jest.MockedFunction<typeof getFeedsApi>).mockResolvedValue(feedRespond);

    await store.dispatch(fetchFeeds.fulfilled(feedRespond, '', undefined));

    expect(store.getState().feeds.orders).toEqual(feedRespond.orders);
    expect(store.getState().feeds.total).toBe(feedRespond.total);
    expect(store.getState().feeds.totalToday).toBe(feedRespond.totalToday);
    expect(store.getState().feeds.isLoading).toBe(false);
  });

  test('should handle rejected action and set error message', async () => {
    const errorMessage = new Error('Failed');

    await store.dispatch(fetchFeeds.rejected(errorMessage, '', undefined));

    expect(store.getState().feeds.error).toBe(errorMessage.message);
    expect(store.getState().feeds.isLoading).toBe(false);
  });
});

describe('feedsSlice/fetchOrderByNumber', () => {
  const mockOrder: TOrder = {
    _id: '67ad3f40133acd001be508cc',
    ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093e'],
    status: 'done',
    name: 'Флюоресцентный люминесцентный метеоритный бургер',
    createdAt: '2025-02-13T00:39:28.075Z',
    updatedAt: '2025-02-13T00:39:28.722Z',
    number: 68312,
  };

  const store = configureStore({
    reducer: {
      feeds: feedsReducer,
    },
  });

  test('should set isLoading to true on pending', async () => {
    store.dispatch(fetchOrderByNumber.pending('', 68312));

    expect(store.getState().feeds.isLoading).toBe(true);
    expect(store.getState().feeds.error).toBe(null);
  });

  test('should set data correctly on fulfilled', async () => {
    (getOrderByNumberApi as jest.MockedFunction<typeof getOrderByNumberApi>).mockResolvedValue({ success: true, orders: [mockOrder] });

    await store.dispatch(fetchOrderByNumber.fulfilled(mockOrder, '', 68312));

    expect(store.getState().feeds.isLoading).toBe(false);
  });

  test('should handle rejected action and set error message', async () => {
    const errorMessage = new Error('Order not found');

    await store.dispatch(fetchOrderByNumber.rejected(errorMessage, '', 68312));

    expect(store.getState().feeds.error).toBe(errorMessage.message);
    expect(store.getState().feeds.isLoading).toBe(false);
  });
});
