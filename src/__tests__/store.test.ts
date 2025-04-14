import { expect, describe, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { feedsReducer, fetchFeeds, fetchOrderByNumber } from '../services/slices/feeds';

let store = configureStore({
  reducer: {
    feeds: feedsReducer,
  },
});

describe('Store - feedsSlice rejected actions', () => {
  beforeEach(() => {
    store = configureStore({
      reducer: { feeds: feedsReducer },
    });
  });

  test('fetchFeeds rejected sets error and resets isLoading', () => {
    const errorText = 'Failed';
    // Передаём объект ошибки через new Error(...)
    store.dispatch(fetchFeeds.rejected(new Error(errorText), '', undefined));
    const state = store.getState().feeds;
    expect(state.error).toBe(errorText);
    expect(state.isLoading).toBe(false);
  });

  test('fetchOrderByNumber rejected sets error and resets isLoading', () => {
    const errorText = 'Order not found';
    store.dispatch(fetchOrderByNumber.rejected(new Error(errorText), '', 68312));
    const state = store.getState().feeds;
    expect(state.error).toBe(errorText);
    expect(state.isLoading).toBe(false);
  });
});
