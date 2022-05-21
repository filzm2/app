import { createAction, props } from '@ngrx/store';

import { IUser } from '@models/user/user.model';

export const UserGetSuccess = createAction('[USER] Get -> Success', props<{ payload: IUser }>());
export const UserGetError = createAction('[USER] Get -> Error', props<{ payload: any }>());
export const UserClear = createAction('[USER] Clear');

export const UserGetId = createAction('[USER] Get Id');
export const UserGetIdSuccess = createAction('[USER] Get Id -> Success', props<{ payload: any }>());
export const UserGetIdError = createAction('[USER] Get Id -> Error', props<{ payload: any }>());

export const UserGet = createAction('[USER] Get');

export const CurrentUserGet = createAction('[CURRENT USER] Get User');
export const CurrentUserGetSuccess = createAction(
  '[CURRENT USER] Get User -> Success',
  props<{ payload: any }>()
);
export const CurrentUserGetError = createAction(
  '[CURRENT USER] Get User -> Error',
  props<{ payload: any }>()
);
