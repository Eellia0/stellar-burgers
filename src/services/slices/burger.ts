import { TConstructorIngredient, TIngredient } from '@utils-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TBurgerState = {
  bun: TIngredient | null;
  ingredients: Array<TConstructorIngredient>;
};

const initialState: TBurgerState = {
  bun: null,
  ingredients: []
};

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    addIngredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.bun = payload;
        } else {
          state.ingredients.push(payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: crypto.randomUUID()
        }
      })
    },
    removeIngredient: (state, { payload }: PayloadAction<String>) => {
      state.ingredients = state.ingredients.filter(
        (index) => index.id !== payload
      );
    },
    moveIngredient: (
      state,
      {
        payload: { startInd, finishInd }
      }: PayloadAction<{ startInd: number; finishInd: number }>
    ) => {
      state.ingredients.splice(
        finishInd,
        0,
        ...state.ingredients.splice(startInd, 1)
      );
    }
  },
  selectors: {
    getBurgerIngredients: (state) => state
  }
});

const burgerReducer = burgerSlice.reducer;

export const { getBurgerIngredients } = burgerSlice.selectors;
export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerSlice.actions;

export default burgerReducer;
