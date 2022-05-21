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


const dashboardDetailPlanReducer = createReducer(
    initState,
    on(DashboardActions.DashboardDetailPlanGetSuccess, (state, {payload}) => ({
        ...state,
        loading: false,
        data: payload
    })),
    on(DashboardActions.DashboardDetailPlanGetError, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload,
    })),
    on(DashboardActions.DashboardClear, state => initState),
  );

  export function reducer(state: State | undefined, action: Action) {
    return dashboardDetailPlanReducer(state, action);
  }