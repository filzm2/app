import * as appState from "@store/reducers";
import { createSelector } from "@ngrx/store";

export const selectUserListState = (state: appState.State) => state.settingsUserList;
export const selectUserState = (state: appState.State) => state.settingsUser;
export const selectSettingsPermissionsState = (state: appState.State) => state.settingsUser;
export const selectRolesListState = (state: appState.State) => state.settingsRoles;
export const selectRoleState = (state: appState.State) => state.settingsRole;
export const selectRowLevelListState = (state: appState.State) => state.rowLevel;
export const selectAllPermissions = (state: appState.State) => state.permissions;


export const selectRoleListNameState = createSelector(
  selectUserState,
  (list) => {
    return list.roles;
  }
);

export const selectAllUsersOptions = createSelector(
  selectUserState,
  (state) => {
    return state.users;
  }
)

export const selectAllPermissionsOptions = createSelector(
  selectRoleState,
  (state) => {
    return state.allPermissions;
  }
)

export const selectUserListOptions = createSelector(
  selectUserState,
  (list) => {
    return list.users;
  }
);

export const selectPermissions = (state) => {
  if (Array.isArray(state.info.permissions) && state.info.permissions.length) {

    const canRead = !!state.info.permissions.find(item => item === 'can_read');
    const canWrite = !!state.info.permissions.find(item => item === 'can_write');
    const permissions = {canRead, canWrite};
    return {
      data: permissions,
      loading: false,
      error: null
    };
  } else {
    return {
      data: { canRead: false, canWrite: false },
      loading: state.loading,
      error: state.error,
    };
  }
}

export const selectUserPermissionsState = createSelector(
  selectUserListState,
  selectPermissions
);

export const selectRolePermissionsState = createSelector(
  selectRolesListState,
  selectPermissions
);
