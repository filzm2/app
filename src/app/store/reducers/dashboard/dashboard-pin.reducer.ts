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

const dashboardPinReducer = createReducer(
  initState,
  on(DashboardActions.DashboardPinSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload,
    error: null,
  })),
  on(DashboardActions.DashboardPinError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    data: null,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return dashboardPinReducer(state, action);
}
