import { createSelector } from '@ngrx/store';
import * as appState from '@store/reducers/index';
import clonedeep from 'lodash.clonedeep';

export const selectDashboardDetailState = (state: appState.State) => state.dashboardDetail;
export const selectDashboardChartsState = (state: appState.State) => state.dashboardCharts;
export const selectDashboardFavoriteStatusState = (state: appState.State) =>
  state.dashboardFavorite;

export const selectDashboardCompleteDetailState = createSelector(
  selectDashboardDetailState,
  selectDashboardChartsState,
  (detail, charts) => {
    if (!detail.loading && detail.data && !charts.loading && charts.data) {
      const newDashboard = clonedeep(detail.data);
      newDashboard.chartsData = charts.data;
      // newDashboard.favorite = favorite.data;

      return {
        data: newDashboard,
        loading: false,
        error: null,
      };
    } else {
      return {
        data: null,
        loading: detail.loading && charts.loading,
        error: {
          dataError: charts.error,
          detailError: detail.error,
        },
      };
    }
  }
);
