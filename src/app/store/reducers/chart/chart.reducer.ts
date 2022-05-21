import {createReducer, on, Action} from '@ngrx/store';
import * as ChartActions from '@store/actions/chart/chart.actions';
import {IListResponse} from "@models/list/list-response.model";
import {IChart} from "@models/chart/chart.model";

export interface State {
  data: IListResponse<IChart>;
  favoriteData: any;
  info: {
    permissions: string[];
  };
  loading: boolean;
  error: any;
  needUpdate: boolean;
  createdChart: any;
}

export const initState = {
  favoriteData: [],
  info: { permissions: [] },
  data: null,
  loading: true,
  error: null,
  needUpdate: false,
  createdChart: null,
};


const chartReducer = createReducer(
  initState,
  on(ChartActions.ChartListGetSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    needUpdate: false,
    data: payload
  })),
  on(ChartActions.ChartListGetError, (state, {payload}) => ({
    ...state,
    loading: false,
    needUpdate: false,
    error: payload,
  })),
  on(ChartActions.ChartListGetMSSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    needUpdate: false,
    data: payload
  })),
  on(ChartActions.ChartListGetMSError, (state, {payload}) => ({
    ...state,
    loading: false,
    needUpdate: false,
    error: payload,
  })),
  on(ChartActions.ChartDeleteSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    needUpdate: true,
    error: null,
  })),
  on(ChartActions.ChartDeleteError, (state, {payload}) => ({
    ...state,
    needUpdate: false,
    loading: false,
    error: payload,
  })),
  on(ChartActions.ChartGetPermissionsSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    needUpdate: false,
    info: {...state.info, ...payload},
    error: null,
  })),
  on(ChartActions.ChartGetPermissionsError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    needUpdate: false,
  })),
  on(ChartActions.ChartGetFavoriteStatusSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    favoriteData: [...state.favoriteData, ...payload.result],
    needUpdate: false,
    error: null,
  })),
  on(ChartActions.ChartGetFavoriteStatusError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    needUpdate: false,
  })),
  on(ChartActions.ChartSetFavoriteStatusSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    favoriteData: [...state.favoriteData, ...payload.result],
    needUpdate: false,
    error: null,
  })),
  on(ChartActions.ChartSetFavoriteStatusError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    needUpdate: false,
  })),
  on(ChartActions.ChartCreateSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    needUpdate: false,
    createdChart: payload,
    error: null,
  })),
  on(ChartActions.ChartCreateError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    needUpdate: false,
  })),

  on(ChartActions.ChartClear, () => initState),
);

export function reducer(state: State | undefined, action: Action) {
  return chartReducer(state, action);
}
