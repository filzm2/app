import { createReducer, on, Action } from '@ngrx/store';
import * as LogUsersActions from '@store/actions/log-users/log-users.actions';

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

const logReducer = createReducer(
  initState,
  on(LogUsersActions.LogUsersListGetSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload
  })),
  on(LogUsersActions.LogUsersListGetError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
  })),
  on(LogUsersActions.LogUsersClear, (state) => initState),
);

export function reducer(state: State | undefined, action: Action) {
  return logReducer(state, action);
}
