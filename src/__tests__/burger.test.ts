import { burgerSlice } from '../../src/services/slices/burger';
import {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../../src/services/slices/burger';
import { TIngredient } from '@utils-types';

describe('burgerSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const bunIngredient: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
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
  };

  const mainIngredient: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
  };

  test('Должен возвращать начальное состояние', () => {
    const state = burgerSlice.reducer(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  test('Должен добавлять булку в конструктор', () => {
    const action = addIngredient(bunIngredient);
    const state = burgerSlice.reducer(initialState, action);
    
    expect(state.bun).toEqual({
      ...bunIngredient,
      id: expect.any(String)
    });
    expect(state.ingredients).toEqual([]);
  });

  test('Должен добавлять основной ингредиент', () => {
    const action = addIngredient(mainIngredient);
    const state = burgerSlice.reducer(initialState, action);
    
    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([{
      ...mainIngredient,
      id: expect.any(String)
    }]);
  });

  test('Должен удалять ингредиент по id', () => {
    const initial = {
      bun: null,
      ingredients: [{
        ...mainIngredient,
        id: 'test-id'
      }]
    };
    
    const state = burgerSlice.reducer(initial, removeIngredient('test-id'));
    expect(state.ingredients).toEqual([]);
  });

  test('Должен перемещать ингредиенты в конструкторе', () => {
    const initial = {
      bun: null,
      ingredients: [
        { ...mainIngredient, id: '1' },
        { ...mainIngredient, id: '2' }
      ]
    };
    
    const state = burgerSlice.reducer(
      initial,
      moveIngredient({ startInd: 0, finishInd: 1 })
    );
    
    expect(state.ingredients[0].id).toBe('2');
    expect(state.ingredients[1].id).toBe('1');
  });

  test('Должен очищать конструктор', () => {
    const initial = {
      bun: { ...bunIngredient, id: 'bun-id' },
      ingredients: [{
        ...mainIngredient,
        id: 'ingredient-id'
      }]
    };
    
    const state = burgerSlice.reducer(initial, clearConstructor());
    expect(state).toEqual(initialState);
  });

  test('Должен возвращать состояние конструктора через селектор', () => {
    const state = {
      burger: {
        bun: { ...bunIngredient, id: 'bun-id' },
        ingredients: [{ ...mainIngredient, id: 'ingredient-id' }]
      }
    };
    
    const result = burgerSlice.selectors.getBurgerIngredients(state);
    expect(result).toEqual({
      bun: { ...bunIngredient, id: 'bun-id' },
      ingredients: [{ ...mainIngredient, id: 'ingredient-id' }]
    });
  });
});
