import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, timer } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as rison from 'rison';
import * as SecurityActions from '@store/actions/settings/security.actions';

@Injectable()
export class SecurityEffects {
  constructor(
    private http: HttpClient,
    private actions$: Actions
  ) {
  }

  getUserList$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.UserListGet),
    mergeMap(action =>
      this.http.get(`/ms/api/v1/user/?q=${rison.encode(action['payload'])}`).pipe(
        map((data: any) => (SecurityActions.UserListGetSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.UserListGetError({payload: err})))
      )
    )
    )
  );

  getUser$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.UserGet),
    mergeMap(action =>
      this.http.get(`/ms/api/v1/user/${action['payload']}`).pipe(
        map((data: any) => (SecurityActions.UserGetSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.UserGetError({payload: err})))
      )
    )
    )
  );

  createUser$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.UserCreate),
    mergeMap(action =>
      this.http.post(`/ms/api/v1/user/`, action.payload).pipe(
        map((data: any) => (SecurityActions.UserCreateSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.UserCreateError({payload: err})))
      )
    )
    )
  );

  saveUser$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.UserSave),
    mergeMap(action =>
      this.http.put(`/ms/api/v1/user/${action.payload.id}`, action.payload.data).pipe(
        map((data: any) => (SecurityActions.UserSaveSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.UserSaveError({payload: err})))
      )
    )
    )
  );

  deleteUser$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.UserDelete),
    mergeMap(action =>
      this.http.delete(`/ms/api/v1/user/${action.payload}`).pipe(
        map((data: any) => (SecurityActions.UserDeleteSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.UserDeleteError({payload: err})))
      )
    )
    )
  );

  getInfo$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.UserGetInfo),
    mergeMap(action =>
      this.http.get(`/ms/api/v1/user/_info?q=${rison.encode(action.payload)}`).pipe(
        map((data: any) => (SecurityActions.UserGetInfoSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.UserGetInfoError({payload: err})))
      )
    )
    )
  );

  userRelated$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.UserRelated),
    mergeMap(action =>
      this.http.get(`/ms/api/v1/user/related/changed_by`).pipe(
        map((data: any) => (SecurityActions.UserRelatedSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.UserRelatedError({payload: err})))
      )
    )
    )
  );

  userGetAllPermissions$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.UserGetAllPermissions),
    mergeMap(action =>
      this.http.get(`/ms/api/v1/user/permissions/`).pipe(
        map((data: any) => (SecurityActions.UserGetAllPermissionsSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.UserGetAllPermissionsError({payload: err})))
      )
    )
    )
  );

  roleListNameGet$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.RoleNameListGet),
    mergeMap(action =>
      this.http.get(`/ms/api/v1/role/all_short/`).pipe(
        map((data: any) => (SecurityActions.RoleNameListGetSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.RoleNameListGetError({payload: err})))
      )
    )
    )
  );

  getRoleList$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.RoleListGet),
    mergeMap(action =>
      this.http.get(`/ms/api/v1/role/?q=${rison.encode(action['payload'])}`).pipe(
      // timer(300).pipe(
        map((data: any) => (SecurityActions.RoleListGetSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.RoleListGetError({payload: err})))
      )
    )
    )
  );

  getRole$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.RoleGet),
    mergeMap(action =>
      this.http.get(`/ms/api/v1/role/${action['payload']}/`).pipe(
        map((data: any) => (SecurityActions.RoleGetSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.RoleGetError({payload: err})))
      )
    )
    )
  );

  createRole$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.RoleCreate),
    mergeMap(action =>
      this.http.post(`/ms/api/v1/role/`, action.payload).pipe(
        map((data: any) => (SecurityActions.RoleCreateSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.RoleCreateError({payload: err})))
      )
    )
    )
  );

  saveRole$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.RoleSave),
    mergeMap(action =>
      this.http.put(`/ms/api/v1/role/${action.payload.id}/`, action.payload.body).pipe(
        map((data: any) => (SecurityActions.RoleSaveSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.RoleSaveError({payload: err})))
      )
    )
    )
  );

  deleteRole$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.RoleDelete),
    mergeMap(action =>
      this.http.delete(`/ms/api/v1/role/${action.payload}/`).pipe(
        map((data: any) => (SecurityActions.RoleDeleteSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.RoleDeleteError({payload: err})))
      )
    )
    )
  );

  getUserListByRole$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.GetUsersByRole),
    mergeMap(action =>
      this.http.get(`/ms/api/v1/role/${action.payload.id}/users/?q=${rison.encode(action.payload.params)}`).pipe(
        map((data: any) => (SecurityActions.GetUsersByRoleSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.GetUsersByRoleError({payload: err})))
      )
    )
    )
  );

  getRoleInfo$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.RoleGetInfo),
    mergeMap(action =>
      this.http.get(`/ms/api/v1/role/_info/?q=${rison.encode(action.payload)}`).pipe(
        map((data: any) => (SecurityActions.RoleGetInfoSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.RoleGetInfoError({payload: err})))
      )
    )
    )
  );

  getAllPermissions$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.GetAllPermissions),
    mergeMap(action =>
      this.http.get(`/ms/api/v1/role/permissions/`).pipe(
        map((data: any) => (SecurityActions.GetAllPermissionsSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.GetAllPermissionsError({payload: err})))
      )
    )
    )
  );

  getRowLevelList$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.RowLevelListGet),
    mergeMap(action =>
      // this.http.get(`/ms/api/v1/row_level/?q=${rison.encode(action['payload'])}`).pipe(
      timer(300).pipe(
        map((data: any) => (SecurityActions.RowLevelListGetSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.RowLevelListGetError({payload: err})))
      )
    )
    )
  );

  getRowLevel$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.RowLevelGet),
    mergeMap(action =>
      this.http.get(`/ms/api/v1/row_level/${action['payload']}`).pipe(
        map((data: any) => (SecurityActions.RowLevelGetSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.RowLevelGetError({payload: err})))
      )
    )
    )
  );

  createRowLevel$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.RowLevelCreate),
    mergeMap(action =>
      this.http.post(`/ms/api/v1/row_level/`, action.payload).pipe(
        map((data: any) => (SecurityActions.RowLevelCreateSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.RowLevelCreateError({payload: err})))
      )
    )
    )
  );

  saveRowLevel$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.RowLevelSave),
    mergeMap(action =>
      this.http.put(`/ms/api/v1/row_level/${action.payload.id}`, action.payload.data).pipe(
        map((data: any) => (SecurityActions.RowLevelSaveSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.RowLevelSaveError({payload: err})))
      )
    )
    )
  );

  deleteRowLevel$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.RowLevelDelete),
    mergeMap(action =>
      this.http.delete(`/ms/api/v1/row_level/${action.payload}`).pipe(
        map((data: any) => (SecurityActions.RowLevelDeleteSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.RowLevelDeleteError({payload: err})))
      )
    )
    )
  );

  getRowLevelInfo$ = createEffect(() => this.actions$.pipe(
    ofType(SecurityActions.RowLevelGetInfo),
    mergeMap(action =>
      this.http.get(`/ms/api/v1/row_level/_info?q=${rison.encode(action.payload)}`).pipe(
        map((data: any) => (SecurityActions.RowLevelGetInfoSuccess({payload: data}))),
        catchError((err) => of(SecurityActions.RowLevelGetInfoError({payload: err})))
      )
    )
    )
  );

}
