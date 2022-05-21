import { createReducer, on, Action } from '@ngrx/store';
import * as DatasetActions from '@store/actions/dataset/dataset.actions';

export interface State {
  success: boolean;
  loading: boolean;
  delete: 'columns' | 'calculated' | 'metrics';
  deleteIndex: number;
  error: any;
  redirect: boolean;
}

export const initState: State = {
  delete: null,
  deleteIndex: null,
  success: false,
  loading: true,
  error: null as any,
  redirect: false,
};

const datasetReducer = createReducer(
  initState,
  on(DatasetActions.DatasetSaveSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
    success: true,
    redirect: true,
  })),
  on(DatasetActions.DatasetSaveError, (state, { payload }) => ({
    ...state,
    loading: false,
    success: false,
    error: payload,
    redirect: false,
  })),
  on(DatasetActions.DatasetDeleteColumnSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    delete: payload.calculated ? 'calculated' : 'columns',
    deleteIndex: payload.index,
    success: true,
    redirect: false,
  })),
  on(DatasetActions.DatasetDeleteColumnError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    redirect: false,
    success: false,
  })),
  on(DatasetActions.DatasetDeleteMetricSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    delete: 'metrics',
    deleteIndex: payload.index,
    success: true,
    redirect: false,
  })),
  on(DatasetActions.DatasetDeleteMetricError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    redirect: false,
    success: false,
  })),
  on(DatasetActions.DatasetUpdateClear, () => initState),
  on(DatasetActions.DatasetUpdateClearHard, () => initState),
);

export function reducer(state: State | undefined, action: Action): State {
  return datasetReducer(state, action);
}
