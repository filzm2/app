import {createReducer, on, Action} from '@ngrx/store';
import * as ChartActions from '@store/actions/chart/chart.actions';
import {ChartSaveDetailDataGetSuccess} from "@store/actions/chart/chart.actions";

export interface State {
    data: any;
    id: string;
    loading: boolean;
    error: any;
    needUpdate: boolean;
    useCache: boolean;
}

export const initState = {
    data: null as any,
    id: null,
    loading: true,
    error: null as any,
    needUpdate: false,
    useCache: false,
};

const chartDetailDataGetReducer = createReducer(
    initState,
    on(ChartActions.ChartDetailDataGetSuccess, (state, {payload, id}) => ({
        ...state,
        loading: false,
        data: payload,
        id: id,
        error: null,
        needUpdate: false,
        useCache: false,
    })),
    on(ChartActions.ChartSaveDetailDataGetSuccess, (state, {payload}) => ({
        ...state,
        loading: false,
        data: payload,
        error: null,
        needUpdate: true,
        useCache: false,
    })),
    on(ChartActions.ChartDetailDataGetError, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload,
        data: null,
        needUpdate: false,
        useCache: false,
    })),

    on(ChartActions.ChartGetFullSuccess, (state, {payload}) => ({
        ...state,
        loading: false,
        data: payload,
        error: null,
        needUpdate: false,
        useCache: true,
    })),

    on(ChartActions.ChartGetFullError, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload,
        data: null,
        needUpdate: false,
        useCache: false,
    })),

    on(ChartActions.ChartClear, state => initState),
  );

export function reducer(state: State | undefined, action: Action) {
  return chartDetailDataGetReducer(state, action);
}
