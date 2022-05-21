import { createReducer, on, Action } from '@ngrx/store';
import * as SecurityActions from '@store/actions/settings/security.actions';

export interface State {
  data: any;
  loading: boolean;
  error: any;
  info: {
    permissions: string[];
  }
}

export const initState = {
  data: null as any,
  loading: true,
  error: null as any,
  info: {
    permissions: [],
  }
};

const rolesReducer = createReducer(
  initState,
  on(SecurityActions.RoleListGetSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    data: payload,
    error: null,
  })),
  on(SecurityActions.RoleListGetError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
  })),
  on(SecurityActions.RoleGetInfoSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    info: payload?.result,
    error: null,
  })),
  on(SecurityActions.RoleGetInfoError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
  })),
);

export function reducer(state: State | undefined, action: Action): State {
  return rolesReducer(state, action);
}
