import { configureStore } from '@reduxjs/toolkit';
import { 
  orderReducer, 
  initialState, 
  createOrder, 
  fetchUserOrders, 
  fetchOrderByNumber, 
  getOrders, 
  getOrderModalData,
  TOrderState
} from '../services/slices/order';
import { orderBurgerApi, getOrdersApi, getOrderByNumberApi } from '../utils/burger-api';
import { TOrder, TOrdersData } from '../utils/types';

// Мокаем API
jest.mock('../utils/burger-api', () => ({
  orderBurgerApi: jest.fn(),
  getOrdersApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

// Типы для тестового хранилища
type TestState = {
  order: TOrderState;
};

const mockOrder: TOrder = {
  _id: '1',
  ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733c7'],
  status: 'done',
  name: 'Space флюоресцентный бургер',
  createdAt: '2025-03-21T20:08:58.070Z',
  updatedAt: '2025-03-21T20:08:58.842Z',
  number: 12345
};

const mockOrdersData: TOrdersData = {
  orders: [mockOrder, {...mockOrder, _id: '2', number: 12346}],
  total: 100,
  totalToday: 5
};

describe('Тесты для слайса заказов', () => {
  let store: ReturnType<typeof configureStore<TestState>>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        order: orderReducer
      },
      preloadedState: {
        order: initialState
      }
    });
    jest.clearAllMocks();
  });

  it('должен возвращать начальное состояние', () => {
    const state = store.getState().order;
    expect(state).toEqual(initialState);
  });

  describe('createOrder (создание заказа)', () => {
    it('должен устанавливать orderRequest в true при начале создания', () => {
      const action = createOrder.pending('test-request-id', ['1', '2']);
      const nextState = orderReducer(initialState, action);
      expect(nextState.orderRequest).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it('должен сохранять данные заказа при успешном создании', async () => {
      (orderBurgerApi as jest.Mock).mockResolvedValue({ order: mockOrder });
      await store.dispatch(createOrder(['1', '2']));
      
      const state = store.getState().order;
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    it('должен сохранять ошибку при неудачном создании', async () => {
      const errorMessage = 'Ошибка создания заказа';
      (orderBurgerApi as jest.Mock).mockRejectedValue(new Error(errorMessage));
      await store.dispatch(createOrder(['1', '2']));
      
      const state = store.getState().order;
      expect(state.error).toBe(errorMessage);
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toBeNull();
    });
  });

  describe('fetchUserOrders (загрузка заказов пользователя)', () => {
    it('должен устанавливать загрузку при начале запроса', () => {
      const action = fetchUserOrders.pending('test-request-id', undefined);
      const nextState = orderReducer(initialState, action);
      expect(nextState.orderRequest).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it('должен сохранять список заказов при успешной загрузке', async () => {
      (getOrdersApi as jest.Mock).mockResolvedValue(mockOrdersData.orders);
      await store.dispatch(fetchUserOrders());
      
      const state = store.getState().order;
      expect(state.orders).toEqual(mockOrdersData.orders);
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBeNull();
    });

    it('должен сохранять ошибку при неудачной загрузке', async () => {
      const errorMessage = 'Ошибка загрузки заказов';
      (getOrdersApi as jest.Mock).mockRejectedValue(new Error(errorMessage));
      await store.dispatch(fetchUserOrders());
      
      const state = store.getState().order;
      expect(state.error).toBe(errorMessage);
      expect(state.orderRequest).toBe(false);
      expect(state.orders).toEqual([]);
    });
  });

  describe('fetchOrderByNumber (загрузка заказа по номеру)', () => {
    it('должен устанавливать загрузку при начале запроса', () => {
      const action = fetchOrderByNumber.pending('test-request-id', 12345);
      const nextState = orderReducer(initialState, action);
      expect(nextState.orderRequest).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it('должен сохранять данные заказа при успешной загрузке', async () => {
      (getOrderByNumberApi as jest.Mock).mockResolvedValue({ orders: [mockOrder] });
      await store.dispatch(fetchOrderByNumber(12345));
      
      const state = store.getState().order;
      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBeNull();
    });

    it('должен сохранять ошибку при неудачной загрузке', async () => {
      const errorMessage = 'Заказ не найден';
      (getOrderByNumberApi as jest.Mock).mockRejectedValue(new Error(errorMessage));
      await store.dispatch(fetchOrderByNumber(12345));
      
      const state = store.getState().order;
      expect(state.error).toBe(errorMessage);
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toBeNull();
    });
  });

  describe('Селекторы', () => {
    const testState = {
      order: {
        ...initialState,
        orders: [mockOrder],
        orderModalData: mockOrder
      }
    };

    it('getOrders должен возвращать список заказов', () => {
      expect(getOrders(testState)).toEqual([mockOrder]);
    });

    it('getOrderModalData должен возвращать данные модального окна', () => {
      expect(getOrderModalData(testState)).toEqual(mockOrder);
    });
  });

  describe('Редьюсеры', () => {
    it('closeOrderModal должен сбрасывать модальные данные', () => {
      const stateWithOrder: TOrderState = {
        ...initialState,
        orderModalData: mockOrder
      };
      
      const action = { type: 'order/closeOrderModal' };
      const nextState = orderReducer(stateWithOrder, action);
      
      expect(nextState.orderModalData).toBeNull();
      expect(nextState.error).toBeNull();
    });

    it('setOrderModalData должен устанавливать данные заказа', () => {
      const action = { 
        type: 'order/setOrderModalData',
        payload: mockOrder
      };
      const nextState = orderReducer(initialState, action);
      
      expect(nextState.orderModalData).toEqual(mockOrder);
    });
  });
});