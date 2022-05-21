import { createReducer, on, Action } from '@ngrx/store';
import * as SettingsActions from '@store/actions/settings/security.actions';
import {IAllPermissions} from "@models/role/role.model";

export interface State {
  data: IAllPermissions;
  loading: boolean;
  error: any;
}

export const initState = {
  data: null as any,
  loading: false,
  error: null as any
};


const permissionsReducer = createReducer(
  initState,
  on(SettingsActions.UserGetAllPermissionsSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    data: payload?.result
  })),
  on(SettingsActions.UserGetAllPermissionsError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
  })),
);

export function reducer(state: State | undefined, action: Action) {
  return permissionsReducer(state, action);
}
