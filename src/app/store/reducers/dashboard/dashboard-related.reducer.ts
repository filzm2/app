import { createReducer, on, Action } from '@ngrx/store';
import * as DashboardActions from '@store/actions/dashboard/dashboard.actions';

export interface ISelectItem {
  text: string;
  value: number;
}

export interface State {
  owners: ISelectItem[];
  creators: ISelectItem[];
  loading: boolean;
  error: any;
}

export const initState: State = {
  owners: null,
  creators: null,
  loading: true,
  error: null as any
};

const dashboardReducer = createReducer(
  initState,
  on(DashboardActions.DashboardGetRelatedOwnersSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    owners: payload.result,
  })),
  on(DashboardActions.DashboardGetRelatedOwnersError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
  })),
  on(DashboardActions.DashboardGetRelatedCreatorsSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    creators: payload.result,
  })),
  on(DashboardActions.DashboardGetRelatedCreatorsError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
  }))
);

export function reducer(state: State | undefined, action: Action): State {
  return dashboardReducer(state, action);
}
