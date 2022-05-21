import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { RouterStateSnapshot, Params, Data } from '@angular/router';

import * as fromRouter from '@ngrx/router-store';

import * as commonReducer from './common/common.reducer';
import * as userReducer from './user/user.reducer';
import * as userIdReducer from './user/user-id.reducer';
import * as startCurrentUserReducer from './user/start-current-user.reducer';

import * as chartReducer from './chart/chart.reducer';
import * as chartDetailReducer from './chart/chart-detail.reducer';
import * as chartDetailDataReducer from './chart/chart-data.reducer';
import * as chartRelatedReducer from './chart/chart-related.reducer';
import * as chartDashboardAddReducer from './chart/chart-dashboard-add.reducer';
import * as chartDashboardDeleteReducer from './chart/chart-dashboard-delete.reducer';
import * as chartDetailDataGetReducer from './chart/chart-data-get.reducer';
import * as chartDetailDataGetCSVReducer from './chart/chart-data-get-csv.reducer';
import * as chartExploreJSONReducer from './chart/chart-explorejson.reducer';

import * as dashboardReducer from './dashboard/dashboard.reducer';
import * as dashboardDetailReducer from './dashboard/dashboard-detail.reducer';
import * as dashboardCreateReducer from './dashboard/dashboard-create.reducer';
import * as dashboardUpdateReducer from './dashboard/dashboard-update.reducer';
import * as dashboardChartsReducer from './dashboard/dashboard-charts.reducer';
import * as dashboardRelatedReducer from './dashboard/dashboard-related.reducer';
import * as dashboardExportReducer from './dashboard/dashboard-export.reducer';
import * as dashboardPinReducer from './dashboard/dashboard-pin.reducer';
import * as dashboardPinsReducer from './dashboard/dashboard-pins.reducer';
import * as dashboardFavoriteStatusReducer from './dashboard/dashboard-favorite.reducer';
import * as dashboardCommentsReducer from './dashboard/dashboard-comments.reducer';
import * as dashboardCommentsAllReducer from './dashboard/dashboard-comments-all.reducer';

import * as databaseListReducer from './database/database-list.reducer';
import * as databaseReducer from './database/database.reducer';
import * as databaseUploadReducer from './database/database-upload.reducer';
import * as databaseValidationReducer from './database/database-validation.reducer';

import * as logReducer from './log/log.reducer';
import * as logUsersReducer from './log-users/log-users.reducer';

import * as datasetReducer from './dataset/dataset.reducer';
import * as datasetListReducer from './dataset/dataset-list.reducer';
import * as datasetCreateReducer from './dataset/dataset-create.reducer';
import * as datasetOwnersReducer from './dataset/dataset-owners.reducer';
import * as datasetDatabasesReducer from './dataset/dataset-databases.reducer';
import * as datasetSchemaReducer from './dataset/dataset-schema.reducer';
import * as datasetTypeReducer from './dataset/dataset-type.reducer';
import * as datasetClearReducer from './dataset/dataset-clear.reducer';
import * as datasetTablesReducer from './dataset/dataset-tables.reducer';
import * as datasetUpdateReducer from './dataset/dataset-update.reducer';
import * as datasetAllSchemaReducer from './dataset/dataset-all-schema.reducer';
import * as settingsUsersReducer from './security/users.reducer';
import * as settingsUserReducer from './security/user.reducer';
import * as settingsRolesReducer from './security/roles.reducer';
import * as settingsRoleReducer from './security/role.reducer';
import * as settingsRowLevelReducer from './security/row-level.reducer';
import * as permissionsReducer from './user/permissions.reducer';

import * as timeRangeReducer from './timerange/timerange.reducer';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
  data: Data;
}

export interface State {
  common: commonReducer.State;
  router: fromRouter.RouterReducerState<RouterStateUrl>;
  user: userReducer.State;
  userId: userReducer.State;
  startCurrentUser: startCurrentUserReducer.State;
  chart: chartReducer.State;
  chartDetail: chartDetailReducer.State;
  chartDetailData: chartDetailDataReducer.State;
  chartRelated: chartRelatedReducer.State;
  chartDashboardAdd: chartDashboardAddReducer.State;
  chartDashboardDelete: chartDashboardDeleteReducer.State;
  chartDetailDataGet: chartDetailDataGetReducer.State;
  chartDetailDataGetCSV: chartDetailDataGetCSVReducer.State;
  chartExploreJSON: chartExploreJSONReducer.State;
  dashboard: dashboardReducer.State;
  dashboardDetail: dashboardDetailReducer.State;
  dashboardCreate: dashboardCreateReducer.State;
  dashboardUpdate: dashboardUpdateReducer.State;
  dashboardCharts: dashboardChartsReducer.State;
  dashboardRelated: dashboardRelatedReducer.State;
  dashboardExport: dashboardExportReducer.State;
  dashboardPin: dashboardPinReducer.State;
  dashboardPins: dashboardPinsReducer.State;
  dashboardFavorite: dashboardFavoriteStatusReducer.State;
  dashboardComments: dashboardCommentsReducer.State;
  dashboardCommentsAll: dashboardCommentsAllReducer.State;
  log: logReducer.State;
  logUsers: logUsersReducer.State;
  dataset: datasetReducer.State;
  datasetList: datasetListReducer.State;
  datasetClear: datasetClearReducer.State;
  datasetCreate: datasetCreateReducer.State;
  datasetOwners: datasetOwnersReducer.State;
  datasetDatabases: datasetDatabasesReducer.State;
  datasetSchema: datasetSchemaReducer.State;
  datasetType: datasetTypeReducer.State;
  datasetTables: datasetTablesReducer.State;
  datasetUpdate: datasetUpdateReducer.State;
  datasetAllSchema: datasetAllSchemaReducer.State;
  databaseList: databaseListReducer.State;
  database: databaseReducer.State;
  databaseValidation: databaseValidationReducer.State;
  settingsUserList: settingsUsersReducer.State;
  settingsUser: settingsUserReducer.State;
  settingsRoles: settingsRolesReducer.State;
  settingsRole: settingsRoleReducer.State;
  rowLevel: settingsRowLevelReducer.State;
  timerange: timeRangeReducer.State;
  permissions: permissionsReducer.State;
  databaseUpload: databaseUploadReducer.State;
}

export const reducers: ActionReducerMap<State> = {
  common: commonReducer.reducer,
  router: fromRouter.routerReducer,
  user: userReducer.reducer,
  userId: userIdReducer.reducer,
  startCurrentUser: startCurrentUserReducer.reducer,
  chart: chartReducer.reducer,
  chartDetail: chartDetailReducer.reducer,
  chartDetailData: chartDetailDataReducer.reducer,
  chartRelated: chartRelatedReducer.reducer,
  chartDashboardAdd: chartDashboardAddReducer.reducer,
  chartDashboardDelete: chartDashboardDeleteReducer.reducer,
  chartDetailDataGet: chartDetailDataGetReducer.reducer,
  chartDetailDataGetCSV: chartDetailDataGetCSVReducer.reducer,
  chartExploreJSON: chartExploreJSONReducer.reducer,
  dashboard: dashboardReducer.reducer,
  dashboardDetail: dashboardDetailReducer.reducer,
  dashboardCreate: dashboardCreateReducer.reducer,
  dashboardUpdate: dashboardUpdateReducer.reducer,
  dashboardCharts: dashboardChartsReducer.reducer,
  dashboardRelated: dashboardRelatedReducer.reducer,
  dashboardExport: dashboardExportReducer.reducer,
  dashboardPin: dashboardPinReducer.reducer,
  dashboardPins: dashboardPinsReducer.reducer,
  dashboardFavorite: dashboardFavoriteStatusReducer.reducer,
  dashboardComments: dashboardCommentsReducer.reducer,
  dashboardCommentsAll: dashboardCommentsAllReducer.reducer,
  log: logReducer.reducer,
  logUsers: logUsersReducer.reducer,
  dataset: datasetReducer.reducer,
  datasetList: datasetListReducer.reducer,
  datasetClear: datasetClearReducer.reducer,
  datasetCreate: datasetCreateReducer.reducer,
  datasetOwners: datasetOwnersReducer.reducer,
  datasetDatabases: datasetDatabasesReducer.reducer,
  datasetSchema: datasetSchemaReducer.reducer,
  datasetType: datasetTypeReducer.reducer,
  datasetTables: datasetTablesReducer.reducer,
  datasetUpdate: datasetUpdateReducer.reducer,
  datasetAllSchema: datasetAllSchemaReducer.reducer,
  databaseList: databaseListReducer.reducer,
  database: databaseReducer.reducer,
  databaseValidation: databaseValidationReducer.reducer,
  settingsUserList: settingsUsersReducer.reducer,
  settingsUser: settingsUserReducer.reducer,
  settingsRoles: settingsRolesReducer.reducer,
  settingsRole: settingsRoleReducer.reducer,
  rowLevel: settingsRowLevelReducer.reducer,
  timerange: timeRangeReducer.reducer,
  permissions: permissionsReducer.reducer,
  databaseUpload: databaseUploadReducer.reducer,
};

export const getRouterState =
  createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>('router');

export class RouterSerializer implements fromRouter.RouterStateSerializer<RouterStateUrl> {
  serialize(state: RouterStateSnapshot): RouterStateUrl {
    let currentRoute = state.root;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    const {
      url,
      root: { queryParams },
    } = state;
    const { params, data } = currentRoute;

    return { url, params, queryParams, data };
  }
}
