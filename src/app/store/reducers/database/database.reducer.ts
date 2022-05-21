import { createReducer, on, Action } from '@ngrx/store';
import * as DatabaseActions from '@store/actions/database/database.actions';
import { IItemResponse } from '@models/list/item-response.model';
import { IDatabaseSettings } from '@models/database/database-settings.model';
import { IMessage } from '@models/message/message.model';
import { IDatabaseRelatedObjects } from "@models/database/database.model";

export interface State {
  data: IItemResponse<IDatabaseSettings>;
  loading: boolean;
  error: any;
  testConnection: IMessage;
  saveStatus: null | 'success' | 'part';
  relatedObjects: IDatabaseRelatedObjects;
}

export const initState = {
  data: null as any,
  loading: true,
  error: null as any,
  testConnection: null,
  saveStatus: null,
  relatedObjects: null,
};


const databaseReducer = createReducer(
  initState,
  on(DatabaseActions.DatabaseGetSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    data: payload,
    error: null,
    testConnection: null,
    saveStatus: null,
  })),
  on(DatabaseActions.DatabaseGetError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
    testConnection: null,
    saveStatus: null,
  })),
  on(DatabaseActions.DatabaseTestConnectionSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    testConnection: payload,
    error: null,
    saveStatus: null,
  })),
  on(DatabaseActions.DatabaseTestConnectionError, (state, {payload}) => ({
    ...state,
    loading: false,
    testConnection: payload,
    error: null,
    saveStatus: null,
  })),
  on(DatabaseActions.DatabaseCreateWithFormSuccess, (state, {payload}) => ({
    ...state,
    testConnection: null,
    error: null,
    saveStatus: 'part',
    data: payload,
  })),
  on(DatabaseActions.DatabaseCreateSuccess, (state, {payload}) => ({
    ...state,
    testConnection: null,
    error: null,
    saveStatus: 'success',
  })),
  on(DatabaseActions.DatabaseSaveSuccess, (state) => ({
    ...state,
    testConnection: null,
    error: null,
    saveStatus: 'success',
  })),
  on(DatabaseActions.DatabaseCreateWithFormError, (state, {payload}) => ({
    ...state,
    testConnection: null,
    saveStatus: null,
    error: payload,
  })),
  on(DatabaseActions.DatabaseCreateError, (state, {payload}) => ({
    ...state,
    testConnection: null,
    saveStatus: null,
    error: payload,
  })),
  on(DatabaseActions.DatabaseCreateClear, (state) => ({
    ...state,
    testConnection: null,
    saveStatus: null,
    error: null,
  })),
  on(DatabaseActions.DatabaseGetRelatedObjectsSuccess, (state, {payload}) => ({
    ...state,
    testConnection: null,
    saveStatus: null,
    relatedObjects: payload,
  })),
  on(DatabaseActions.DatabaseGetRelatedObjectsError, (state, {payload}) => ({
    ...state,
    testConnection: null,
    saveStatus: null,
    relatedObjects: null,
    error: payload,
  })),
  on(DatabaseActions.DatabaseListClear, state => initState),
  on(DatabaseActions.DatabaseClear, state => initState),
);

export function reducer(state: State | undefined, action: Action): State {

  return databaseReducer(state, action);
}
