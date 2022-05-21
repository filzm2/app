import { createReducer, on, Action } from '@ngrx/store';
import * as DatabaseActions from '@store/actions/database/database.actions';

export interface State {
  data: any;
  loading: boolean;
  error: any;
}

export const initState = {
  data: null as any,
  loading: true,
  error: null as any,
};

const databaseReducer = createReducer(
  initState,
  on(DatabaseActions.DatabaseValidateParametersSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload,
    error: null,
  })),
  on(DatabaseActions.DatabaseValidateParametersError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    data: null,
  })),
  on(DatabaseActions.DatabaseListClear, state => initState),
);

export function reducer(state: State | undefined, action: Action): State {

  return databaseReducer(state, action);
}
