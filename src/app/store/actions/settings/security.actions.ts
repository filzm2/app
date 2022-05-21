import { createAction, props } from "@ngrx/store";
import { IUserInfo, IUserSave } from "@models/user/user.model";
import { IRole } from "@models/role/role.model";
import { IRowLevel } from "@models/row-level/row-level.model";

export const UserListGet = createAction('[USER] List Get', props<{payload: any}>());
export const UserListGetSuccess = createAction('[USER] List Get -> Success', props<{payload: { result: IUserInfo[] }}>());
export const UserListGetError = createAction('[USER] List Get -> Error', props<{payload: any}>());
export const UserListClear = createAction('[USER] List Clear');

export const UserGet = createAction('[USER] Get*', props<{payload: any}>());
export const UserGetSuccess = createAction('[USER] Get* -> Success', props<{payload: { result: IUserInfo }}>());
export const UserGetError = createAction('[USER] Get* -> Error', props<{payload: any}>());
export const UserClear = createAction('[USER] Get* Clear');

export const UserCreate = createAction('[USER] Create', props<{payload: IUserSave}>());
export const UserCreateSuccess = createAction('[USER] Create -> Success', props<{payload: { result: { id: number } }}>());
export const UserCreateError = createAction('[USER] Create -> Error', props<{payload: any}>());

export const UserSave = createAction('[USER] Save', props<{payload: { data: IUserInfo, id: number }}>());
export const UserSaveSuccess = createAction('[USER] Save -> Success', props<{payload: { result: string }}>());
export const UserSaveError = createAction('[USER] Save -> Error', props<{payload: any}>());

export const UserDelete = createAction('[USER] Delete', props<{payload: number}>());
export const UserDeleteSuccess = createAction('[USER] Delete -> Success', props<{payload: { result: string }}>());
export const UserDeleteError = createAction('[USER] Delete -> Error', props<{payload: any}>());

export const UserGetInfo = createAction('[USER] Get Info', props<{payload: any}>());
export const UserGetInfoSuccess = createAction('[USER] Get Info -> Success', props<{payload: any}>());
export const UserGetInfoError = createAction('[USER] Get Info -> Error', props<{payload: any}>());

export const UserRelated = createAction('[USER] Related');
export const UserRelatedSuccess = createAction('[USER] Related -> Success', props<{payload: any}>());
export const UserRelatedError = createAction('[USER] Related -> Error', props<{payload: any}>());

export const UserGetAllPermissions = createAction('[USER] Get All Permissions');
export const UserGetAllPermissionsSuccess = createAction('[USER] Get All Permissions -> Success', props<{payload: any}>());
export const UserGetAllPermissionsError = createAction('[USER] Get All Permissions -> Error', props<{payload: any}>());

export const RoleNameListGet = createAction('[ROLE] Name List Get');
export const RoleNameListGetSuccess = createAction('[ROLE] Name List Get -> Success', props<{payload: { result: string[] }}>());
export const RoleNameListGetError = createAction('[ROLE] Name List Get -> Error', props<{payload: any}>());

export const RoleListGet = createAction('[ROLE] List Get', props<{payload: any}>());
export const RoleListGetSuccess = createAction('[ROLE] List Get -> Success', props<{payload: { result: IRole[] }}>());
export const RoleListGetError = createAction('[ROLE] List Get -> Error', props<{payload: any}>());

export const RoleGet = createAction('[ROLE] Get', props<{payload: any}>());
export const RoleGetSuccess = createAction('[ROLE] Get -> Success', props<{payload: { result: IRole }}>());
export const RoleGetError = createAction('[ROLE] Get -> Error', props<{payload: any}>());
export const RoleClear = createAction('[ROLE] Clear*');

export const RoleCreate = createAction('[ROLE] Create', props<{payload: IRole}>());
export const RoleCreateSuccess = createAction('[ROLE] Create -> Success', props<{payload: { result: any }}>());
export const RoleCreateError = createAction('[ROLE] Create -> Error', props<{payload: any}>());

export const RoleSave = createAction('[ROLE] Save', props<{payload: { body: IRole, id: number }}>());
export const RoleSaveSuccess = createAction('[ROLE] Save -> Success', props<{payload: { result: any }}>());
export const RoleSaveError = createAction('[ROLE] Save -> Error', props<{payload: any}>());

export const RoleDelete = createAction('[ROLE] Delete', props<{payload: number}>());
export const RoleDeleteSuccess = createAction('[ROLE] Delete -> Success', props<{payload: { result: any }}>());
export const RoleDeleteError = createAction('[ROLE] Delete -> Error', props<{payload: any}>());

export const GetUsersByRole = createAction('[ROLE] Get Users', props<{payload: { params: any, id: number }}>());
export const GetUsersByRoleSuccess = createAction('[ROLE] Get Users -> Success', props<{payload: { result: any }}>());
export const GetUsersByRoleError = createAction('[ROLE] Get Users -> Error', props<{payload: any}>());

export const GetAllPermissions = createAction('[ROLE] All Permissions');
export const GetAllPermissionsSuccess = createAction('[ROLE] All Permissions -> Success', props<{payload: { result: any }}>());
export const GetAllPermissionsError = createAction('[ROLE] All Permissions -> Error', props<{payload: any}>());

export const RoleGetInfo = createAction('[ROLE] Get Info', props<{payload: any}>());
export const RoleGetInfoSuccess = createAction('[ROLE] Get Info -> Success', props<{payload: any}>());
export const RoleGetInfoError = createAction('[ROLE] Get Info -> Error', props<{payload: any}>());

export const RowLevelListGet = createAction('[ROW LEVEL] List Get', props<{payload: any}>());
export const RowLevelListGetSuccess = createAction('[ROW LEVEL] List Get -> Success', props<{payload: { result: IRowLevel[] }}>());
export const RowLevelListGetError = createAction('[ROW LEVEL] List Get -> Error', props<{payload: any}>());

export const RowLevelGet = createAction('[ROW LEVEL] Get*', props<{payload: any}>());
export const RowLevelGetSuccess = createAction('[ROW LEVEL] Get* -> Success', props<{payload: { result: IRowLevel }}>());
export const RowLevelGetError = createAction('[ROW LEVEL] Get* -> Error', props<{payload: any}>());

export const RowLevelCreate = createAction('[ROW LEVEL] Create', props<{payload: IRowLevel}>());
export const RowLevelCreateSuccess = createAction('[ROW LEVEL] Create -> Success', props<{payload: { result: { id: number } }}>());
export const RowLevelCreateError = createAction('[ROW LEVEL] Create -> Error', props<{payload: any}>());

export const RowLevelSave = createAction('[ROW LEVEL] Save', props<{payload: { data: IRowLevel, id: number }}>());
export const RowLevelSaveSuccess = createAction('[ROW LEVEL] Save -> Success', props<{payload: { result: string }}>());
export const RowLevelSaveError = createAction('[ROW LEVEL] Save -> Error', props<{payload: any}>());

export const RowLevelDelete = createAction('[ROW LEVEL] Delete', props<{payload: number}>());
export const RowLevelDeleteSuccess = createAction('[ROW LEVEL] Delete -> Success', props<{payload: { result: string }}>());
export const RowLevelDeleteError = createAction('[ROW LEVEL] Delete -> Error', props<{payload: any}>());

export const RowLevelGetInfo = createAction('[ROW LEVEL] Get Info', props<{payload: any}>());
export const RowLevelGetInfoSuccess = createAction('[ROW LEVEL] Get Info -> Success', props<{payload: any}>());
export const RowLevelGetInfoError = createAction('[ROW LEVEL] Get Info -> Error', props<{payload: any}>());
