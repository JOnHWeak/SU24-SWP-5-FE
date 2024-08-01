import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { ServiceRequest } from '@/models/account';
import { AppState } from './store';

import { LIST_MENU_NOT_USER, MenuItem } from '@/component/header-feature/header-feature.constant';

export type CommonState = {
  isLoading: boolean;
  isInit: boolean;
  isNormalHeader: boolean;
  listServices: ServiceRequest[];
  listMenuHeader: MenuItem[];
};

const initialState: CommonState = {
  isLoading: false,
  isInit: false,
  isNormalHeader: false,
  listServices: [],
  listMenuHeader: LIST_MENU_NOT_USER,
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },

    setIsInit(state, action) {
      state.isInit = action.payload;
    },

    setIsNormalHeader(state, action) {
      state.isNormalHeader = action.payload;
    },

    setListServices(state, action) {
      state.listServices = action.payload;
    },

    setListMenuHeader(state, action) {
      state.listMenuHeader = action.payload;
    },
  },

  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.common,
      };
    },
  },
});

export const { setIsLoading, setIsInit, setIsNormalHeader, setListServices, setListMenuHeader } =
  commonSlice.actions;

export const selectCommonState = (state: AppState) => state.common;
