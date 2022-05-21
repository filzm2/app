import { createReducer, on, Action } from '@ngrx/store';
import * as DashboardActions from '@store/actions/dashboard/dashboard.actions';

export interface State {
  data: any;
  favoriteData: any;
  info: {
    permissions: string[];
  };
  loading: boolean;
  error: any;
  needUpdate: boolean;
}

export const initState = {
  favoriteData: [],
  info: { permissions: [] },
  data: null as any,
  loading: true,
  error: null as any,
  needUpdate: false,
};

const dashboardReducer = createReducer(
  initState,
  on(DashboardActions.DashboardListGetSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload,
    needUpdate: false,
    error: null,
  })),
  on(DashboardActions.DashboardListGetError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    needUpdate: false,
  })),
  on(DashboardActions.DashboardFavoriteStatusListGetSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    favoriteData: payload.result,
    needUpdate: false,
    error: null,
  })),
  on(DashboardActions.DashboardFavoriteStatusListGetError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    needUpdate: false,
  })),
  on(DashboardActions.DashboardDeleteSuccess, (state) => ({
    ...state,
    loading: false,
    needUpdate: true,
    error: null,
  })),
  on(DashboardActions.DashboardDeleteError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    needUpdate: false,
  })),
  on(DashboardActions.DashboardGetInfoSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    needUpdate: false,
    info: { ...state.info, ...payload },
    error: null,
  })),
  on(DashboardActions.DashboardGetInfoError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    needUpdate: false,
  })),
  on(DashboardActions.DashboardSetFavoriteStatusSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    favoriteData: [...state.favoriteData, ...payload.result],
    needUpdate: false,
    error: null,
  })),
  on(DashboardActions.DashboardSetFavoriteStatusError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    needUpdate: false,
  })),
  on(DashboardActions.DashboardClear, () => initState)
);

export function reducer(state: State | undefined, action: Action) {
  return dashboardReducer(state, action);
}
