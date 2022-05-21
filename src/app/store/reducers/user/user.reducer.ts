import { createReducer, on, Action } from '@ngrx/store';
import * as UserActions from '@store/actions/user/user.actions';
import { IUser } from '@models/user/user.model';

export interface State {
    data: IUser;
    loading: boolean;
    error: any;
}

export const initState = {
    data: null as any,
    loading: false,
    error: null as any
};


const userReducer = createReducer(
    initState,
    on(UserActions.UserGetSuccess, (state, {payload}) => ({
        ...state,
        loading: false,
        data: payload
    })),
    on(UserActions.UserGetError, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload,
    })),
    on(UserActions.UserClear, state => initState),
  );

  export function reducer(state: State | undefined, action: Action) {
    return userReducer(state, action);
  }