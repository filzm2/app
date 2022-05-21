import { createReducer, on, Action } from '@ngrx/store';
import * as DatasetActions from '@store/actions/dataset/dataset.actions';

export interface State {
  success: boolean;
  loading: boolean;
  error: any;
  id: number;
}

export const initState: State = {
  success: false,
  loading: true,
  error: null,
  id: null,
};

const datasetReducer = createReducer(
  initState,
  on(DatasetActions.DatasetCreateSuccess, (state, { payload }) => ({
    ...state,
    success: true,
    loading: false,
    error: null,
    id: payload.id,
  })),
  on(DatasetActions.DatasetCreateError, (state, { payload }) => ({
    ...state,
    success: false,
    loading: false,
    error: payload,
    id: null,
  })),
  on(DatasetActions.DatasetCreateClear, () => initState),
);

export function reducer(state: State | undefined, action: Action) {
  return datasetReducer(state, action);
}
