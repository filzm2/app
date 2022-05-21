import { createReducer, on, Action } from '@ngrx/store';
import * as SecurityActions from '@store/actions/settings/security.actions';
import { IUserInfo } from "@models/user/user.model";

export interface State {
  data: any;
  loading: boolean;
  error: any;
  roles: string[];
  users: { text: string, id: number }[];
  success: boolean;
}

export const initState = {
  data: null as any,
  loading: true,
  error: null as any,
  roles: [],
  users: [],
  success: false,
};


const userReducer = createReducer(
  initState,
  on(SecurityActions.UserGetSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    data: payload,
    error: null,
    success: false,
  })),
  on(SecurityActions.UserGetError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
    success: false,
  })),
  on(SecurityActions.RoleNameListGetSuccess, (state, {payload}) => ({
    ...state,
    roles: payload?.result,
    error: null,
    success: false,
  })),
  on(SecurityActions.RoleNameListGetError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
    success: false,
  })),
  on(SecurityActions.UserRelatedSuccess, (state, {payload}) => ({
    ...state,
    users: payload?.result,
    error: null,
    success: false,
  })),
  on(SecurityActions.UserRelatedError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
    success: false,
  })),
  on(SecurityActions.UserCreateSuccess, (state, {payload}) => ({
    ...state,
    success: true,
  })),
  on(SecurityActions.UserCreateError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
    success: false,
  })),
  on(SecurityActions.UserSaveSuccess, (state, {payload}) => ({
    ...state,
    success: true,
  })),
  on(SecurityActions.UserSaveError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
    success: false,
  })),
  on(SecurityActions.UserSaveSuccess, (state, {payload}) => ({
    ...state,
    success: true,
  })),
  on(SecurityActions.UserSaveError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
    success: false,
  })),
  on(SecurityActions.UserClear, state => initState),
);

export function reducer(state: State | undefined, action: Action): State {
  return userReducer(state, action);
}
