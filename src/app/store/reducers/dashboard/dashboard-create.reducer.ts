import { createReducer, on, Action } from '@ngrx/store';
import * as DashboardActions from '@store/actions/dashboard/dashboard.actions';

export interface State {
    data: any;
    loading: boolean;
    error: any;
    created: boolean;
}

export const initState = {
    data: null as any,
    loading: true,
    error: null as any,
    created: false
};

const dashboardCreateReducer = createReducer(
    initState,
    on(DashboardActions.DashboardCreateSuccess, (state, {payload}) => ({
        ...state,
        loading: false,
        data: payload,
        created: true,
    })),
    on(DashboardActions.DashboardCreateError, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload,
    })),
    on(DashboardActions.DashboardCreatedClear, state => initState),
  );

  export function reducer(state: State | undefined, action: Action) {
    return dashboardCreateReducer(state, action);
  }