import { Observable } from "rxjs";
import { IUserInfo, IUserSave } from "@models/user/user.model";
import { IRole } from "@models/role/role.model";
import { IRowLevel } from "@models/row-level/row-level.model";

export type TUserColumnName = 'fullName' | 'email' | 'formatRoles' | 'activity' | 'actions';
export type TUserColumnDBName = 'last_name' | 'email' | 'active';
export type TRowLevelColumnName = 'checkboxes' | 'tables' | 'condition' | 'group_key' | 'roles' | 'author' | 'changed_on' | 'actions';

export interface IFiltersSettings {
  role: IFilter;
  created: IFilter;
  changed: IFilter;
  name: IFilter;
  surname: IFilter;
  login: IFilter;
  status: IFilter;
  email: IFilter;
  lastLogin: IFilter;
  loginCount: IFilter;
  errorCount: IFilter;
  createdDate: IFilter;
  changedDate: IFilter;
  roleName: IFilter;
  permissions: IFilter;
  user: IFilter;
  table: IFilter;
  roles_includes: IFilter;
  roles_excludes: IFilter;
  group_key: IFilter;
  condition: IFilter;
}

export interface IFilter {
  inputType: number;
  requestType?: string;
  name?: string;
  label: string;
  selectOptions?: Observable<any>;
}

export interface IUserInfoDatasource extends IUserInfo {
  fullName?: string;
  formatRoles?: {
    name: string;
    filled: boolean;
  };
  restRoles: {
    text: string;
    count: number;
  }
}

export interface IRowLevelDatasource extends IRowLevel {
  include?: boolean;
  select?: boolean;
  formatRoles?: {
    name: string;
    filled: boolean;
  };
}

export interface IUserSaveMiddle extends IUserSave {
  passwordRepeat: string;
}

export interface IGroupCheckboxState {
  all: (keyof IRole)[];
  admin: (keyof IRole)[];
  edit: (keyof IRole)[];
  read: (keyof IRole)[];
}

export type TAvailableFilters = keyof IFiltersSettings;

export type TRoleColumnName = 'role' | 'actions';
export type TRoleColumnDBName = 'name' | 'id';

export type TRoleCheckboxGroup = 'all' | 'admin' | 'edit' | 'read';
