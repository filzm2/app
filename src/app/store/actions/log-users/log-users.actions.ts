import { createAction, props } from '@ngrx/store';

export const LogUsersListGet = createAction(
  '[LOG USERS] List Get',
  props<{ payload: any; }>());

export const LogUsersListGetSuccess = createAction(
  '[LOG USERS] List Get -> Success',
  props<{ payload: any; }>());

export const LogUsersListGetError = createAction(
  '[LOG USERS] List Get -> Error',
  props<{ payload: any; }>());

export const LogUsersClear = createAction('[LOG USERS] Clear');
