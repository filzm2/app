import { createReducer, on, Action } from '@ngrx/store';
import * as UserActions from '@store/actions/user/user.actions';
import { IUser } from '@app/models/user/user.model';

export interface State {
  data: IUser;
  loading: boolean;
  error: any;
}

export const initState = {
  data: null as any,
  loading: false,
  error: null as any,
};

const startCurrentUserReducer = createReducer(
  initState,
  on(UserActions.CurrentUserGetSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload['result'],
  })),
  on(UserActions.CurrentUserGetError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return startCurrentUserReducer(state, action);
}
