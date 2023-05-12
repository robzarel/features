import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import root from './slices/root';

const rootReducer = combineReducers({ root });

let store: ReturnType<typeof configureStore>;

const getStore = () => {
  store = configureStore({ reducer: rootReducer });

  return store;
};

export default getStore;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
