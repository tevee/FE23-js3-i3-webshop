/* 
  Redux store
*/

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import webshopReducer from '../redux/webshopSlice';

export const store = configureStore({
  reducer: {
    webshop: webshopReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
