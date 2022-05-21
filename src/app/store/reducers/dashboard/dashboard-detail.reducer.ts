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


const dashboardDetailReducer = createReducer(
    initState,
    on(DashboardActions.DashboardDetailGetSuccess, (state, {payload}) => ({
        ...state,
        loading: false,
        data: payload,
        created: false,
        updated: false,
    })),
    on(DashboardActions.DashboardDetailGetError, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload,
        created: false,
        updated: false
    })),
    on(DashboardActions.DashboardClear, state => initState),
  );

  export function reducer(state: State | undefined, action: Action) {
    return dashboardDetailReducer(state, action);
  }