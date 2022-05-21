import { createReducer, on, Action } from '@ngrx/store';
import * as SecurityActions from '@store/actions/settings/security.actions';
import { IUserInfo } from "@models/user/user.model";

export interface State {
  data: any;
  loading: boolean;
  error: any;
  success: boolean;
  deleteSuccess: boolean;
  allPermissions: string[];
}

export const initState = {
  data: null as any,
  loading: true,
  error: null as any,
  success: false,
  deleteSuccess: false,
  allPermissions: [],
};


const roleReducer = createReducer(
  initState,
  on(SecurityActions.RoleGetSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    data: payload,
    error: null,
    success: false,
    deleteSuccess: false,
  })),
  on(SecurityActions.RoleGetError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
    success: false,
    deleteSuccess: false,
  })),
  on(SecurityActions.RoleNameListGetSuccess, (state, {payload}) => ({
    ...state,
    roles: payload?.result,
    error: null,
    success: false,
    deleteSuccess: false,
  })),
  on(SecurityActions.RoleNameListGetError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
    success: false,
    deleteSuccess: false,
  })),
  on(SecurityActions.RoleCreateSuccess, (state, {payload}) => ({
    ...state,
    success: true,
    deleteSuccess: false,
  })),
  on(SecurityActions.RoleCreateError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
    success: false,
    deleteSuccess: false,
  })),
  on(SecurityActions.RoleSaveSuccess, (state, {payload}) => ({
    ...state,
    success: true,
    deleteSuccess: false,
  })),
  on(SecurityActions.RoleSaveError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
    success: false,
    deleteSuccess: false,
  })),
  on(SecurityActions.RoleDeleteSuccess, (state, {payload}) => ({
    ...state,
    success: false,
    deleteSuccess: true,
  })),
  on(SecurityActions.RoleDeleteError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
    success: false,
    deleteSuccess: false,
  })),
  on(SecurityActions.GetAllPermissionsSuccess, (state, {payload}) => ({
    ...state,
    allPermissions: payload.result,
    success: false,
    deleteSuccess: false,
  })),
  on(SecurityActions.GetAllPermissionsError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
    success: false,
    allPermissions: [],
    deleteSuccess: false,
  })),
  on(SecurityActions.RoleClear, state => initState),
);

export function reducer(state: State | undefined, action: Action): State {
  return roleReducer(state, action);
}
