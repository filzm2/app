import { createReducer, on, Action } from '@ngrx/store';
import * as DatasetActions from '@store/actions/dataset/dataset.actions';

export interface State {
  data: any;
  loading: boolean;
  error: any;
  info: { permissions: string[] };
}

export const initState = {
  data: null as any,
  loading: true,
  error: null as any,
  info: {permissions: []}
};

const datasetListReducer = createReducer(
  initState,
  on(DatasetActions.DatasetListGetSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload,
    error: null,
  })),
  on(DatasetActions.DatasetListGetError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
  })),
  on(DatasetActions.DatasetGetInfoSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    info:  {...state.info, ...payload},
    error: null,
  })),
  on(DatasetActions.DatasetGetError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
  })),
  on(DatasetActions.DatasetClear, () => initState),
  on(DatasetActions.DatasetUpdateClearHard, () => initState),
);

export function reducer(state: State | undefined, action: Action) {
  return datasetListReducer(state, action);
}
