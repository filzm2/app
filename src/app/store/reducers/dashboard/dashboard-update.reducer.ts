import { createReducer, on, Action } from '@ngrx/store';
import * as DashboardActions from '@store/actions/dashboard/dashboard.actions';

export interface State {
    data: any;
    loading: boolean;
    error: any;
    updated: boolean;
}

export const initState = {
    data: null as any,
    loading: true,
    error: null as any,
    updated: false
};

const dashboardUpdateReducer = createReducer(
    initState,
    on(DashboardActions.DashboardDetailUpdateSuccess, (state, {payload}) => ({
        ...state,
        loading: false,
        data: payload,
        updated: true,
    })),
    on(DashboardActions.DashboardDetailUpdateError, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload,
    })),
    on(DashboardActions.DashboardUpdatedClear, state => initState),
  );

  export function reducer(state: State | undefined, action: Action) {
    return dashboardUpdateReducer(state, action);
  }