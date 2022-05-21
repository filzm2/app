import { createReducer, on, Action } from '@ngrx/store';
import * as DashboardCommentsActions from '@store/actions/dashboard/dashboard-comments.actions';

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

const dashboardCommentsAllReducer = createReducer(
  initState,
  on(DashboardCommentsActions.DashboardCommentsGetSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload,
    error: null,
  })),
  on(DashboardCommentsActions.DashboardCommentsGetError, (state, { payload }) => ({
    ...state,
    loading: false,
    data: null,
    error: payload,
  }))
  // on(DashboardCommentsActions.DashboardCommentsClear, state => initState),
);

export function reducer(state: State | undefined, action: Action) {
  return dashboardCommentsAllReducer(state, action);
}
