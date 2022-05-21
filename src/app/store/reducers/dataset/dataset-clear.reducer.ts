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

const datasetReducer = createReducer(
  initState,
  on(DatasetActions.DatasetClearSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload,
  })),
  on(DatasetActions.DatasetClearError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
  })),
  on(DatasetActions.DatasetClear, () => initState),
);

export function reducer(state: State | undefined, action: Action) {
  return datasetReducer(state, action);
}
