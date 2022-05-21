import { createReducer, on, Action } from '@ngrx/store';
import * as ChartActions from '@store/actions/chart/chart.actions';

export interface State {
    data: any;
    chartName: string;
    loading: boolean;
    error: any;
}

export const initState = {
    data: null as any,
    chartName: '',
    loading: true,
    error: null as any
};


const chartDetailDataGetCSVReducer = createReducer(
    initState,
    on(ChartActions.ChartDetailDataGetCSVSuccess, (state, {payload, name}) => ({
        ...state,
        loading: false,
        data: payload,
        chartName: name,
        error: null,
    })),
    on(ChartActions.ChartDetailDataGetCSVError, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload,
        data: null,
        chartName: ''
    })),
    on(ChartActions.ChartClear, state => initState),
  );

  export function reducer(state: State | undefined, action: Action) {
    return chartDetailDataGetCSVReducer(state, action);
  }