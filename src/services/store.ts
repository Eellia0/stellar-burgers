import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import userReducer from './slices/user';
import ingredientsReducer from './slices/ingredients';
import burgerReducer from './slices/burger';
import { feedsReducer } from './slices/feeds';
import { orderReducer } from './slices/order';

const rootReducer = combineReducers({
  user: userReducer,
  ingredients: ingredientsReducer,
  burger: burgerReducer,
  feeds: feedsReducer,
  order: orderReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
