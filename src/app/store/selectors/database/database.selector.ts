import { createSelector } from '@ngrx/store';
import * as appState from '@store/reducers/index';

export const selectDatabaseListState = (state: appState.State) => state.databaseList;
export const selectDatabaseState = (state: appState.State) => state.database;
export const selectDatabaseValidationState = (state: appState.State) => state.databaseValidation;
export const selectDatabaseUploadState = (state: appState.State) => state.databaseUpload;

export const selectDatabasePermissionsState = createSelector(
  selectDatabaseListState,
  (list) => {
    if (Array.isArray(list.info.permissions) && list.info.permissions.length) {

      const canRead = !!list.info.permissions.find(item => item === 'can_read');
      const canWrite = !!list.info.permissions.find(item => item === 'can_write');
      const permissions = {canRead, canWrite};
      return {
        data: permissions,
        loading: false,
        error: null
      };
    } else {
      return {
        data: { canRead: false, canWrite: false },
        loading: list.loading,
        error: list.error,
      };
    }
  }
);

export const selectDatabaseAvailableState = createSelector(
  selectDatabaseListState,
  (list) => {
    return list.availableData;
  }
);

export const selectDatabaseRelatedObjects = createSelector(
  selectDatabaseState,
  (stase) => {
    return stase.relatedObjects;
  }
);

export const selectTestConnectionState = createSelector(
  selectDatabaseState,
  (state) => {
    return state.testConnection;
  }
);

export const selectDatabasesCSVState = createSelector(
  selectDatabaseUploadState,
  (state) => {
    return state.databasesCSV;
  }
);

export const selectDatabasesExcelState = createSelector(
  selectDatabaseUploadState,
  (state) => {
    return state.databasesExcel;
  }
);

export const selectSchemasExcelState = createSelector(
  selectDatabaseUploadState,
  (state) => {
    return state.schemasExcel;
  }
);

export const selectSchemasCSVState = createSelector(
  selectDatabaseUploadState,
  (state) => {
    return state.schemasCSV;
  }
);
