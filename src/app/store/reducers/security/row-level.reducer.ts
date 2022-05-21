import { createReducer, on, Action } from '@ngrx/store';
import * as SecurityActions from '@store/actions/settings/security.actions';
import { IRowLevel } from "@models/row-level/row-level.model";

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

const mockRowLevels: IRowLevel[] = [
  {
    id: 1,
    tables: ['table'],
    condition: '1=1',
    group_key: 'group.key',
    roles_includes: ['Admin'],
    roles_excludes: null,
    author: 'admin admin',
    changed_on: '111111',
  },
  {
    id: 2,
    tables: ['table'],
    condition: '1=1',
    group_key: 'group.key',
    roles_includes: null,
    roles_excludes: ['Admin'],
    author: 'admin admin',
    changed_on: '111111',
  },
  {
    id: 3,
    tables: ['table'],
    condition: '1=1',
    group_key: 'group.key',
    roles_includes: ['Admin', 'user'],
    roles_excludes: null,
    author: 'admin admin',
    changed_on: '111111',
  },
  {
    id: 4,
    tables: ['table'],
    condition: '1=1',
    group_key: 'group.key',
    roles_includes: null,
    roles_excludes: ['gamma', 'user'],
    author: 'admin admin',
    changed_on: '111111',
  },
  {
    id: 5,
    tables: ['table'],
    condition: '1=1',
    group_key: 'group.key',
    roles_includes: ['Admin'],
    roles_excludes: null,
    author: 'admin admin',
    changed_on: '111111',
  },
]


const rowLevelReducer = createReducer(
  initState,
  on(SecurityActions.RowLevelListGetSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    data: mockRowLevels,
    error: null,
  })),
  on(SecurityActions.RowLevelListGetError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
  })),
);

export function reducer(state: State | undefined, action: Action): State {
  return rowLevelReducer(state, action);
}
