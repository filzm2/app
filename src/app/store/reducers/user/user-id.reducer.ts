import { createReducer, on, Action } from '@ngrx/store';
import * as UserActions from '@store/actions/user/user.actions';
import { IUserId } from '@app/models/user/user.model';

export interface State {
  data: IUserId;
  loading: boolean;
  error: any;
}

export const initState = {
  data: null as any,
  loading: false,
  error: null as any,
};

const userIdReducer = createReducer(
  initState,
  on(UserActions.UserGetIdSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload['result'],
  })),
  on(UserActions.UserGetIdError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return userIdReducer(state, action);
}
