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
    error: null as any
};


const dashboardChartsReducer = createReducer(
    initState,
    on(DashboardActions.DashboardDetailChartGetSuccess, (state, {payload}) => ({
        ...state,
        loading: false,
        data: payload,
        error: null,
    })),
    on(DashboardActions.DashboardDetailChartGetError, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload,
        data: null,
    })),
    on(DashboardActions.DashboardClear, state => initState),
  );

  export function reducer(state: State | undefined, action: Action) {
    return dashboardChartsReducer(state, action);
  }