import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Themes } from '../../components/theme';
import { FEATURE_FLAGS } from '../../types/common/index';
import type { Languages } from '../../components/localization';

type STATE = {
  theme: Themes;
  language: 'ru' | 'en';
  featureFlags?: FEATURE_FLAGS;
};

const getInitialState = (): STATE => {
  const theme = (localStorage.getItem('features-color-theme') ||
    'light') as Themes;
  const language = (localStorage.getItem('features-cv-language') ||
    'ru') as Languages;

  return { theme, language };
};

const rootSlice = createSlice({
  name: 'root',
  initialState: getInitialState,
  reducers: {
    setTheme(state, action: PayloadAction<{ value: STATE['theme'] }>) {
      state.theme = action.payload.value;
    },
    setLanguage(state, action: PayloadAction<{ value: STATE['language'] }>) {
      state.language = action.payload.value;
    },
    setFeatureFlags(state, action: PayloadAction<{ value: FEATURE_FLAGS }>) {
      state.featureFlags = action.payload.value;
    },
  },
});

const { actions, reducer } = rootSlice;

export const { setTheme, setLanguage, setFeatureFlags } = actions;
export default reducer;
