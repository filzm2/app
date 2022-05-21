import { createReducer, on, Action } from '@ngrx/store';
import * as ChartActions from '@store/actions/chart/chart.actions';
import {IDatasetListItem} from "@models/dataset/dataset.model";

export interface ISelectItem {
  text: string;
  value: number;
}

export interface State {
  owners: ISelectItem[];
  creators: ISelectItem[];
  datasets: IDatasetListItem[];
  vizTypes: string[];
  loading: boolean;
  error: any;
}

export const initState: State = {
  owners: null,
  creators: null,
  datasets: null,
  vizTypes: null,
  loading: true,
  error: null as any
};

const chartReducer = createReducer(
  initState,
  on(ChartActions.ChartRelatedOwnersSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    owners: payload.result,
  })),
  on(ChartActions.ChartRelatedOwnersError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
  })),
  on(ChartActions.ChartRelatedCreatorsSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    creators: payload.result,
  })),
  on(ChartActions.ChartRelatedCreatorsError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
  })),
  on(ChartActions.ChartRelatedVizTypesSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    vizTypes: payload.result,
  })),
  on(ChartActions.ChartRelatedVizTypesError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
  })),
  on(ChartActions.ChartRelatedDatasetsSuccess, (state, {payload}) => ({
    ...state,
    loading: false,
    datasets: payload.result,
  })),
  on(ChartActions.ChartRelatedDatasetsError, (state, {payload}) => ({
    ...state,
    loading: false,
    error: payload,
  }))
);

export function reducer(state: State | undefined, action: Action): State {
  return chartReducer(state, action);
}
