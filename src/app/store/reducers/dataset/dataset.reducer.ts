import { createReducer, on, Action } from '@ngrx/store';
import * as DatasetActions from '@store/actions/dataset/dataset.actions';
import { IItemResponse } from "@models/list/item-response.model";
import { IDatasetSettings } from "@models/dataset/dataset-edit-settings.model";

export interface State {
  data: IItemResponse<IDatasetSettings>;
  loading: boolean;
  error: any;
  syncColumns: any;
  syncColumnsError: any;
}

export const initState = {
  data: null as any,
  loading: true,
  error: null as any,
  syncColumns: null,
  syncColumnsError: null,
};

const datasetReducer = createReducer(
  initState,
  on(DatasetActions.DatasetGetSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload,
    error: null,
    syncColumns: null,
    syncColumnsError: null,
  })),
  on(DatasetActions.DatasetGetError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    syncColumns: null,
    syncColumnsError: null,
  })),
  on(DatasetActions.DatasetSyncColumnsSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    syncColumns: payload,
    syncColumnsError: null,
    error: null,
  })),
  on(DatasetActions.DatasetSyncColumnsError, (state, { payload }) => ({
    ...state,
    loading: false,
    syncColumns: null,
    syncColumnsError: payload,
  })),
  on(DatasetActions.DatasetClear, () => initState),
  on(DatasetActions.DatasetUpdateClearHard, () => initState),
);

export function reducer(state: State | undefined, action: Action) {
  return datasetReducer(state, action);
}
