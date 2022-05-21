import { createReducer, on, Action } from '@ngrx/store';
import * as DatasetActions from '@store/actions/dataset/dataset.actions';

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

const datasetAllSchemaReducer = createReducer(
  initState,
  on(DatasetActions.DatasetAllSchemaGetSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload,
  })),
  on(DatasetActions.DatasetAllSchemaGetError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
  })),
  on(DatasetActions.DatasetSchemaClear, () => initState),
);

export function reducer(state: State | undefined, action: Action) {
  return datasetAllSchemaReducer(state, action);
}
