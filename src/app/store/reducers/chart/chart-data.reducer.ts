import { createReducer, on, Action } from '@ngrx/store';
import * as ChartActions from '@store/actions/chart/chart.actions';

export interface State {
    data: any;
    chartData: any;
    loading: boolean;
    error: any;
}

export const initState = {
    data: null as any,
    chartData: null as any,
    loading: true,
    error: null as any
};


const chartDetailDataReducer = createReducer(
    initState,
    on(ChartActions.ChartDetailDataPostSuccess, (state, {payload, chartData}) => ({
        ...state,
        loading: false,
        data: payload,
        chartData: chartData,
        error: null,
    })),
    on(ChartActions.ChartDetailDataPostError, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload,
        data: null,
        chartData: null
    })),
    on(ChartActions.ChartClear, state => initState),
  );

  export function reducer(state: State | undefined, action: Action) {
    return chartDetailDataReducer(state, action);
  }