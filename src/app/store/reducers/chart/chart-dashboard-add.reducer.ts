import { createReducer, on, Action } from '@ngrx/store';
import * as ChartActions from '@store/actions/chart/chart.actions';

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

const chartDashboardAddReducer = createReducer(
  initState,
  on(ChartActions.ChartAddDashboardSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload,
    error: null,
  })),
  on(ChartActions.ChartAddDashboardError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    data: null,
  })),
  on(ChartActions.ChartClear, (state) => initState)
);

export function reducer(state: State | undefined, action: Action) {
  return chartDashboardAddReducer(state, action);
}
