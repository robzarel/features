import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Themes } from '../../components/theme/useTheme';

type STATE = {
  theme: Themes;
  language: 'ru' | 'en';
};

const initialState: STATE = {
  theme: 'light',
  language: 'ru',
};

const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<{ value: STATE['theme'] }>) {
      state.theme = action.payload.value;
    },
    setLanguage(state, action: PayloadAction<{ value: STATE['language'] }>) {
      state.language = action.payload.value;
    },
  },
});

const { actions, reducer } = rootSlice;

export const { setTheme, setLanguage } = actions;
export default reducer;
