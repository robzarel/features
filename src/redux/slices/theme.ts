import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type STATE = {
  value: string;
};

const initialState: STATE = {
  value: '',
};

const themeSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<STATE>) {
      const { value } = action.payload;
      state.value = value;
    },
  },
});

const { actions, reducer } = themeSlice;

export const { setTheme } = actions;
export default reducer;
