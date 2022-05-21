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


const dashboardFavoriteStatusReducer = createReducer(
    initState,
    on(DashboardActions.DashboardFavoriteStatusListGetSuccess, (state, { payload }) => ({
        ...state,
        loading: false,
        data: payload.result,
        error: null,
      })),
      on(DashboardActions.DashboardFavoriteStatusListGetError, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload,
      })),
    on(DashboardActions.DashboardClear, state => initState),
  );

  export function reducer(state: State | undefined, action: Action) {
    return dashboardFavoriteStatusReducer(state, action);
  }