import { createReducer, on, Action } from '@ngrx/store';
import * as SecurityActions from '@store/actions/settings/security.actions';
import { IUserInfo } from "@models/user/user.model";

export interface State {
  data: any;
  loading: boolean;
  error: any;
  needUpdate: boolean;
  info: any;
}

export const initState = {
  data: null as any,
  loading: true,
  error: null as any,
  needUpdate: false,
  info: {
    permissions: [],
  },
};


const usersReducer = createReducer(
  initState,
  on(SecurityActions.UserListGetSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    data: payload,
    error: null,
    needUpdate: false,
  })),
  on(SecurityActions.UserListGetError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
    needUpdate: false,
  })),
  on(SecurityActions.UserGetInfoSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    info: payload?.result,
    error: null,
    needUpdate: false,
  })),
  on(SecurityActions.UserGetInfoError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
    needUpdate: false,
  })),
  on(SecurityActions.UserDeleteSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    needUpdate: true,
  })),
  on(SecurityActions.UserDeleteError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
    needUpdate: false,
  })),
  on(SecurityActions.UserListClear, state => initState),
);

export function reducer(state: State | undefined, action: Action): State {
  return usersReducer(state, action);
}
