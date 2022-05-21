import { createReducer, on, Action } from '@ngrx/store';
import * as DatabaseActions from '@store/actions/database/database.actions';

export interface State {
  success: boolean;
  error: any;
  schemasCSV: any[];
  schemasExcel: any[];
  databasesCSV: any[];
  databasesExcel: any[];
}

export const initState = {
  success: false,
  error: null,
  schemasCSV: [],
  schemasExcel: [],
  databasesCSV: [],
  databasesExcel: [],
};


const databaseUploadReducer = createReducer(
  initState,
  on(DatabaseActions.UploadCSVSuccess, (state, {payload}) => ({
    ...state,
    success: true,
    error: null,
  })),
  on(DatabaseActions.UploadCSVError, (state, {payload}) => ({
    ...state,
    success: false,
    error: payload,
  })),
  on(DatabaseActions.UploadExcelSuccess, (state, {payload}) => ({
    ...state,
    success: true,
    error: null,
  })),
  on(DatabaseActions.UploadExcelError, (state, {payload}) => ({
    ...state,
    success: false,
    error: payload,
  })),
  on(DatabaseActions.DatabasesExcelSuccess, (state, {payload}) => ({
    ...state,
    databasesExcel: payload.result,
    success: false,
    error: null,
  })),
  on(DatabaseActions.DatabasesExcelError, (state, {payload}) => ({
    ...state,
    success: false,
    error: payload,
  })),
  on(DatabaseActions.DatabasesCSVSuccess, (state, {payload}) => ({
    ...state,
    databasesCSV: payload.result,
    success: false,
    error: null,
  })),
  on(DatabaseActions.DatabasesCSVError, (state, {payload}) => ({
    ...state,
    success: false,
    error: payload,
  })),
  on(DatabaseActions.GetSchemasForExcelSuccess, (state, {payload}) => ({
    ...state,
    schemasExcel: payload.result,
    success: false,
    error: null,
  })),
  on(DatabaseActions.GetSchemasForExcelError, (state, {payload}) => ({
    ...state,
    success: false,
    error: payload,
  })),
  on(DatabaseActions.GetSchemasForCSVSuccess, (state, {payload}) => ({
    ...state,
    schemasCSV: payload.result,
    success: false,
    error: null,
  })),
  on(DatabaseActions.GetSchemasForCSVError, (state, {payload}) => ({
    ...state,
    success: false,
    error: payload,
  })),
  on(DatabaseActions.DatabaseUploadClear, state => initState),
);

export function reducer(state: State | undefined, action: Action): State {

  return databaseUploadReducer(state, action);
}
