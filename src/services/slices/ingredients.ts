import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

export type TIngredientsState = {
  isLoading: boolean;
  ingredients: Array<TIngredient>;
  error: string | null;
};

const initialState: TIngredientsState = {
  isLoading: false,
  ingredients: [],
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => await getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsLoading: (state) => state.isLoading,
    getIngredients: (state) => state.ingredients,
    getIngredientById: (state, id: string) =>
      state.ingredients.find((item) => item._id === id)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Neispravnost';
      });
  }
});

export const { getIngredientsLoading, getIngredients, getIngredientById } =
  ingredientsSlice.selectors;

const ingredientsReducer = ingredientsSlice.reducer;

export default ingredientsReducer;
