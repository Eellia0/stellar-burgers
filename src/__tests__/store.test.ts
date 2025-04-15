import store, { rootReducer } from '../services/store';

import { expect, describe, test } from '@jest/globals';

describe('Проверка правильной инициализации rootReducer', () => {
  test('rootReducer должен возвращать корректное начальное состояние', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState).toEqual(store.getState()); // Сравниваем с реальным хранилищем
  });

  test('rootReducer не изменяет состояние при неизвестном экшене', () => {
    const prevState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    const newState = rootReducer(prevState, { type: 'UNKNOWN_ACTION' });

    expect(newState).toEqual(prevState);
  });
});
