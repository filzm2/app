import { createSelector } from '@ngrx/store';
import * as appState from '@store/reducers/index';

export const selectChartDetailState = (state: appState.State) => state.chartDetail;
export const selectChartDataState = (state: appState.State) => state.chartDetailData;
export const selectChartListState = (state: appState.State) => state.chart;
export const selectChartRelatedState = (state: appState.State) => state.chartRelated;
export const selectChartNewDetailDataState = (state: appState.State) => state.chartDetailDataGet;

export const selectChartCompleteDetailState = createSelector(
  selectChartDetailState,
  selectChartNewDetailDataState,
  (detail, data) => {
    if ((!detail.loading && detail.data) || (!data.loading && data.data)) {
      let newChart = Object.assign({}, detail.data);

      console.log('Данные', data.data);
      if (Array.isArray(data.data?.result) && data.data?.result?.length) {
        newChart.graphData = data.data;
      } else {
        newChart.graphData = {};
        newChart.graphData.result = [];
        newChart.graphData.result.push(data.data);
      }
      newChart.detail = detail.data;
      return {
        data: newChart,
        loading: false,
        error: null,
        needUpdate: data.needUpdate,
        useCache: data.useCache
      };
    } else {
      return {
        data: null,
        loading: detail.loading && data.loading,
        error: data.error | detail.error | (null as any),
        needUpdate: data.needUpdate,
        useCache: data.useCache
      };
    }
  }
);

export const selectRelatedDatasets = createSelector(selectChartRelatedState, (data) => {
  if (Array.isArray(data.datasets)) {
    return data.datasets.map((dataset) => ({
      label: dataset.table_name,
      value: {
        id: dataset.id,
        datasourceName: dataset.table_name,
        datasourceType: dataset.kind,
      },
    }));
  }
});
