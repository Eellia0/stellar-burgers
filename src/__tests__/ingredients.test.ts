import { getIngredientsApi } from '../utils/burger-api';
import ingredientsSlice, {
  fetchIngredients,
  getIngredientsLoading,
  getIngredients,
  getIngredientById,
  TIngredientsState
} from '../services/slices/ingredients';
import { TIngredient } from '../utils/types';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('../utils/burger-api', () => ({
  getIngredientsApi: jest.fn()
}));

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  }
];

const initialState: TIngredientsState = {
  isLoading: false,
  ingredients: [],
  error: null
};

describe('ingredientsSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен возвращать начальное состояние', () => {
    const state = ingredientsSlice(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  describe('fetchIngredients', () => {
    it('должен устанавливать загрузку при начале запроса', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsSlice(initialState, action);
      expect(state.isLoading).toBe(true);
    });

    it('должен сохранять ингредиенты при успешном ответе', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsSlice(initialState, action);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.isLoading).toBe(false);
    });

    it('должен сохранять ошибку при неудачном запросе', () => {
      const errorMessage = 'Ошибка сервера';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsSlice(initialState, action);
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('селекторы', () => {
    const testState = {
      ingredients: {
        isLoading: true,
        ingredients: mockIngredients,
        error: null
      }
    };

    it('должен возвращать статус загрузки', () => {
      expect(getIngredientsLoading(testState)).toBe(true);
    });

    it('должен возвращать список ингредиентов', () => {
      expect(getIngredients(testState)).toEqual(mockIngredients);
    });

    it('должен находить ингредиент по ID', () => {
      expect(getIngredientById(testState, '1')).toEqual(mockIngredients[0]);
    });
  });

  describe('работа с хранилищем', () => {
    it('должен корректно обновлять состояние хранилища', async () => {
      (getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients);

      const store = configureStore({
        reducer: {
          ingredients: ingredientsSlice
        }
      });

      await store.dispatch(fetchIngredients());

      const state = store.getState().ingredients;
      expect(state.ingredients).toEqual(mockIngredients);
    });
  });
});

describe('getIngredientsApi', () => {
  it('должен возвращать данные ингредиентов', async () => {
    (getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients);
    const result = await getIngredientsApi();
    expect(result).toEqual(mockIngredients);
  });

  it('должен обрабатывать ошибки запроса', async () => {
    const errorMessage = 'Ошибка сервера';
    (getIngredientsApi as jest.Mock).mockRejectedValue(new Error(errorMessage));
    await expect(getIngredientsApi()).rejects.toThrow(errorMessage);
  });
});