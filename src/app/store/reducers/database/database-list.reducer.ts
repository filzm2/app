import { createReducer, on, Action } from '@ngrx/store';
import * as DatabaseActions from '@store/actions/database/database.actions';
import { IAvailableData, IDatabase } from '@models/database/database.model';
import { IListResponse } from '@models/list/list-response.model';

export interface State {
  data: IListResponse<IDatabase>;
  info: {
    permissions: string[];
  };
  loading: boolean;
  error: any;
  needUpdate: boolean;
  availableData: IAvailableData[];
}

export const initState = {
  info: { permissions: [] },
  data: null as any,
  loading: true,
  error: null as any,
  needUpdate: false,
  availableData: [],
};


const databaseReducer = createReducer(
  initState,
  on(DatabaseActions.DatabaseListGetSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload,
    error: null,
    needUpdate: false,
  })),
  on(DatabaseActions.DatabaseListGetError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    needUpdate: false,
  })),
  on(DatabaseActions.DatabaseAvailableGetSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    availableData: payload?.databases,
    error: null,
    needUpdate: false,
  })),
  on(DatabaseActions.DatabaseAvailableGetError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    needUpdate: false,
  })),
  on(DatabaseActions.DatabaseDeleteSuccess, (state) => ({
    ...state,
    loading: false,
    needUpdate: true,
    error: null,
  })),
  on(DatabaseActions.DatabaseDeleteError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    needUpdate: false,
  })),
  on(DatabaseActions.DatabaseSaveSuccess, (state) => ({
    ...state,
    loading: false,
    needUpdate: true,
    error: null,
  })),
  on(DatabaseActions.DatabaseSaveError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    needUpdate: false,
  })),
  on(DatabaseActions.DatabaseGetInfoSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    needUpdate: false,
    info: {...state.info, ...payload},
    error: null,
  })),
  on(DatabaseActions.DatabaseCreateWithFormSuccess, (state, { payload }) => ({
    ...state,
    error: null,
    needUpdate: true,
  })),
  on(DatabaseActions.DatabaseCreateSuccess, (state, { payload }) => ({
    ...state,
    error: null,
    needUpdate: true,
  })),
  on(DatabaseActions.DatabaseGetInfoError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    needUpdate: false,
  })),
  on(DatabaseActions.DatabaseListClear, state => initState),
);

export function reducer(state: State | undefined, action: Action): State {
  return databaseReducer(state, action);
}
