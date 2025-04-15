import { expect, test, describe, jest, beforeEach } from '@jest/globals';
import { configureStore, ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import {
  userSlice,
  registerUser,
  loginUser,
  logoutUser,
  checkUserAuth,
  updateUser
} from '../services/slices/user';
import * as api from '@api';
import { setCookie, deleteCookie } from '../utils/cookie';
import 'jest-localstorage-mock';
import { TRegisterData, TLoginData } from '../utils/burger-api';
import { TUserState } from '../services/slices/user';

type RootState = {
  user: TUserState;
};

type TUser = {
  email: string;
  name: string;
};

jest.mock('../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn()
}));

jest.mock('@api', () => ({
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn()
}));

describe('userSlice', () => {
  let store = configureStore({ reducer: { user: userSlice.reducer } });
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

  beforeEach(() => {
    store = configureStore({ reducer: { user: userSlice.reducer } });
    localStorage.clear();
    jest.clearAllMocks();
  });

  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  const mockAuthResponse = {
    success: true,
    user: mockUser,
    accessToken: 'access-token',
    refreshToken: 'refresh-token'
  };

  describe('registerUser', () => {
    const registerData: TRegisterData = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password'
    };

    test('fulfilled updates state and sets cookies', async () => {
      (api.registerUserApi as jest.Mock<any>).mockResolvedValue(mockAuthResponse);
      await (store.dispatch as AppDispatch)(registerUser(registerData));

      const state = store.getState() as RootState;
      expect(state.user.isLoading).toBe(false);
      expect(state.user.isAuthenticated).toBe(true);
      expect(state.user.user).toEqual(mockUser);
      expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh-token');
      expect(setCookie).toHaveBeenCalledWith('accessToken', 'access-token');
    });

    test('rejected sets error', async () => {
      const error = new Error('Registration failed');
      (api.registerUserApi as jest.Mock<any>).mockRejectedValue(error);
      
      await (store.dispatch as AppDispatch)(registerUser(registerData));

      const state = store.getState() as RootState;
      expect(state.user.isLoading).toBe(false);
      expect(state.user.error).toBe(error.message);
    });
  });

  describe('logoutUser', () => {
    test('fulfilled clears user data', async () => {
      (api.logoutApi as jest.Mock<any>).mockResolvedValue({});
      await (store.dispatch as AppDispatch)(logoutUser());

      const state = store.getState() as RootState;
      expect(state.user.isAuthenticated).toBe(false);
      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(deleteCookie).toHaveBeenCalledWith('accessToken');
    });
  });

  describe('checkUserAuth', () => {
    test('fulfilled with user sets auth', async () => {
      (api.getUserApi as jest.Mock<any>).mockResolvedValue({ success: true, user: mockUser });
      await (store.dispatch as AppDispatch)(checkUserAuth());

      const state = store.getState() as RootState;
      expect(state.user.isAuthChecked).toBe(true);
      expect(state.user.isAuthenticated).toBe(true);
    });

    test('rejected clears auth', async () => {
      (api.getUserApi as jest.Mock<any>).mockRejectedValue(new Error());
      await (store.dispatch as AppDispatch)(checkUserAuth());

      const state = store.getState() as RootState;
      expect(state.user.isAuthChecked).toBe(true);
      expect(state.user.isAuthenticated).toBe(false);
    });
  });

  describe('updateUser', () => {
    const updateData = { name: 'New Name' };

    test('fulfilled updates user data', async () => {
      const updatedUser = { ...mockUser, name: 'New Name' };
      (api.updateUserApi as jest.Mock<any>).mockResolvedValue({ success: true, user: updatedUser });
      await (store.dispatch as AppDispatch)(updateUser(updateData));

      const state = store.getState() as RootState;
      expect(state.user.user?.name).toBe('New Name');
      expect(state.user.error).toBeNull();
    });
  });

  describe('reducers', () => {
    test('setUser updates user data', () => {
      store.dispatch(userSlice.actions.setUser(mockUser));
      expect((store.getState() as RootState).user.user).toEqual(mockUser);

      store.dispatch(userSlice.actions.setUser(null));
      expect((store.getState() as RootState).user.user).toBeNull();
    });
  });
});
