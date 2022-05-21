import { createReducer, on, Action } from '@ngrx/store';
import * as DashboardCommentsActions from '@store/actions/dashboard/dashboard-comments.actions';

export interface State {
  data: any;
  loading: boolean;
  error: any;
  status: any;
}

export const initState = {
  data: null as any,
  loading: true,
  error: null as any,
  status: null as any,
};

const dashboardCommentsReducer = createReducer(
  initState,
  on(DashboardCommentsActions.DashboardChartCommentsGetSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload,
    error: null,
    status: null,
  })),
  on(DashboardCommentsActions.DashboardChartCommentsGetError, (state, { payload }) => ({
    ...state,
    loading: false,
    data: null,
    error: payload,
    status: null,
  })),
  on(DashboardCommentsActions.DashboardChartCommentsPostSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    error: null,
    status: payload,
  })),
  on(DashboardCommentsActions.DashboardChartCommentsPostError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
  })),
  on(DashboardCommentsActions.DashboardChartCommentsPutError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
  })),
  on(DashboardCommentsActions.DashboardChartCommentsDeleteSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    error: null,
    status: payload,
  })),
  on(DashboardCommentsActions.DashboardChartCommentsDeleteError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
  })),
  on(DashboardCommentsActions.DashboardCommentsClear, (state) => initState)
);

export function reducer(state: State | undefined, action: Action) {
  return dashboardCommentsReducer(state, action);
}
