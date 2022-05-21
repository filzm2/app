import { createReducer, on, Action } from '@ngrx/store';
import * as DashboardActions from '@store/actions/dashboard/dashboard.actions';

export interface State {
  data: any;
  loading: boolean;
  error: any;
}

export const initState = {
  data: null as any,
  loading: true,
  error: null as any,
};

const dashboardPinsReducer = createReducer(
  initState,
  on(DashboardActions.DashboardGetPinsSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload,
    error: null,
  })),
  on(DashboardActions.DashboardGetPinsError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    data: null,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return dashboardPinsReducer(state, action);
}
