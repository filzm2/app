import { createReducer, on, Action } from '@ngrx/store';
import * as LogActions from '@store/actions/log/log.actions';

export interface State {
    data: any;
    loading: boolean;
    error: any;
}

export const initState = {
    data: null as any,
    loading: true,
    error: null as any
};


const logReducer = createReducer(
    initState,
    on(LogActions.LogListGetSuccess, (state, {payload}) => ({
        ...state,
        loading: false,
        data: payload
    })),
    on(LogActions.LogListGetError, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload,
    })),
    on(LogActions.LogClear, state => initState),
  );

export function reducer(state: State | undefined, action: Action) {
  return logReducer(state, action);
}
