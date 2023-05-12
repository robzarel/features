import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Themes } from '../../components/theme';
import { COMMON, CV, FEATURE_FLAGS } from '../../types/common/index';
import type { Languages } from '../../components/localization';

type STATE = {
  theme: Themes;
  language: 'ru' | 'en';

  // async part of the state
  featureFlags?: FEATURE_FLAGS;
  cv?: CV;
  common?: COMMON[];
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
    setFeatureFlags(
      state,
      action: PayloadAction<{ value: Required<STATE['featureFlags']> }>
    ) {
      state.featureFlags = action.payload.value;
    },
    setCv(state, action: PayloadAction<{ value: Required<STATE['cv']> }>) {
      state.cv = action.payload.value;
    },
    setCommon(
      state,
      action: PayloadAction<{ value: Required<STATE['common']> }>
    ) {
      state.common = action.payload.value;
    },
  },
});

const { actions, reducer } = rootSlice;

export const { setTheme, setLanguage, setFeatureFlags, setCv, setCommon } =
  actions;
export default reducer;
