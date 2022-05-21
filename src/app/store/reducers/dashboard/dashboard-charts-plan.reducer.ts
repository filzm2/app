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


const dashboardPlanChartsReducer = createReducer(
    initState,
    on(DashboardActions.DashboardDetailPlanChartGetSuccess, (state, {payload}) => ({
        ...state,
        loading: false,
        data: payload,
        error: null,
    })),
    on(DashboardActions.DashboardDetailPlanChartGetError, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload,
        data: null,
    })),
    on(DashboardActions.DashboardClear, state => initState),
  );

  export function reducer(state: State | undefined, action: Action) {
    return dashboardPlanChartsReducer(state, action);
  }