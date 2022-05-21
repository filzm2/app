import { createSelector } from '@ngrx/store';
import * as appState from '@store/reducers/index';

export const selectDatasetListState = (state: appState.State) => state.datasetList;
export const selectDatasetState = (state: appState.State) => state.dataset;
export const selectDatasetUpdateState = (state: appState.State) => state.datasetUpdate;

export const selectDatasetPermissionsState = createSelector(
  selectDatasetListState,
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
