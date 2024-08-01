import { createSlice } from '@reduxjs/toolkit';
import { AppState } from './store';
import { HYDRATE } from 'next-redux-wrapper';

export type AuthState = {
  renderHeaderInfo: number;
};

const initialState: AuthState = {
  renderHeaderInfo: 0,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRenderHeaderInfo(state, action) {
      state.renderHeaderInfo = action.payload;
    },
  },

  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

export const { setRenderHeaderInfo } = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth;
