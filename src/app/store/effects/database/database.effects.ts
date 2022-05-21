import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, finalize, map, mergeMap} from 'rxjs/operators';
import * as rison from 'rison';
import * as DatabaseActions from '@store/actions/database/database.actions';

@Injectable()
export class DatabaseEffects {
  constructor(
    private http: HttpClient,
    private actions$: Actions
  ) {
  }

  getDatabaseList$ = createEffect(() => this.actions$.pipe(
    ofType(DatabaseActions.DatabaseListGet),
    mergeMap(action =>
      this.http.get(`/api/v1/database/?q=${rison.encode(action['payload'])}`).pipe(
        map((data: any) => (DatabaseActions.DatabaseListGetSuccess({payload: data}))),
        catchError((err) => of(DatabaseActions.DatabaseListGetError({payload: err})))
      )
    )
    )
  );

  getDatabasePermissions$ = createEffect(() => this.actions$.pipe(
    ofType(DatabaseActions.DatabaseGetInfo),
    mergeMap(action =>
      this.http.get(`/api/v1/database/_info?q=${rison.encode(action['payload'])}`).pipe(
        map((data: any) => (DatabaseActions.DatabaseGetInfoSuccess({payload: {...data, id: action.payload}}))),
        catchError((err) => of(DatabaseActions.DatabaseGetInfoError({payload: err})))
      )
    )
    )
  );

  getDatabase$ = createEffect(() => this.actions$.pipe(
    ofType(DatabaseActions.DatabaseGet),
    mergeMap(action =>
      this.http.get(`/api/v1/database/${action['payload']}`).pipe(
        map((data: any) => (DatabaseActions.DatabaseGetSuccess({payload: data}))),
        catchError((err) => of(DatabaseActions.DatabaseGetError({payload: err})))
      )
    )
    )
  );

  testDatabaseConnection$ = createEffect(() => this.actions$.pipe(
    ofType(DatabaseActions.DatabaseTestConnection),
    mergeMap(action =>
      this.http.post(`/api/v1/database/test_connection`, action.payload.data).pipe(
        map((data: any) => (DatabaseActions.DatabaseTestConnectionSuccess({payload: data}))),
        catchError((err) => of(DatabaseActions.DatabaseTestConnectionError({payload: err})))
      )
    )
    )
  );

  saveDatabase$ = createEffect(() => this.actions$.pipe(
    ofType(DatabaseActions.DatabaseSave),
    mergeMap(action =>
      this.http.put(`/api/v1/database/${action.payload.id}`, action.payload.data).pipe(
        map((data: any) => (DatabaseActions.DatabaseSaveSuccess())),
        catchError((err) => of(DatabaseActions.DatabaseSaveError({payload: err})))
      )
    )
    )
  );

  createDatabase$ = createEffect(() => this.actions$.pipe(
    ofType(DatabaseActions.DatabaseCreate),
    mergeMap(action =>
      this.http.post(`/api/v1/database/`, action.payload).pipe(
        map((data: any) => (DatabaseActions.DatabaseCreateSuccess({payload: data}))),
        catchError((err) => of(DatabaseActions.DatabaseCreateError({payload: err})))
      )
    )
    )
  );

  createDatabaseWithForm$ = createEffect(() => this.actions$.pipe(
    ofType(DatabaseActions.DatabaseCreateWithForm),
    mergeMap(action =>
      this.http.post(`/api/v1/database/`, action.payload).pipe(
        map((data: any) => (DatabaseActions.DatabaseCreateWithFormSuccess({payload: data}))),
        catchError((err) => of(DatabaseActions.DatabaseCreateWithFormError({payload: err})))
      )
    )
    )
  );

  getAvailableDatabases$ = createEffect(() => this.actions$.pipe(
    ofType(DatabaseActions.DatabaseAvailableGet),
    mergeMap(action =>
      this.http.get(`/api/v1/database/available/`).pipe(
        map((data: any) => (DatabaseActions.DatabaseAvailableGetSuccess({payload: data}))),
        catchError((err) => of(DatabaseActions.DatabaseAvailableGetError({payload: err})))
      )
    )
    )
  );

  deleteDatabase$ = createEffect(() => this.actions$.pipe(
    ofType(DatabaseActions.DatabaseDelete),
    mergeMap(action => {
        return this.http.delete(`/api/v1/database/${action['payload']}`).pipe(
          map((data: any) => (DatabaseActions.DatabaseDeleteSuccess({payload: data}))),
          catchError((err) => of(DatabaseActions.DatabaseDeleteError({payload: err})))
        );
      }
    )
    )
  );

  validateParameters$ = createEffect(() => this.actions$.pipe(
    ofType(DatabaseActions.DatabaseValidateParameters),
    mergeMap(action => {
        return this.http.post(`/api/v1/database/validate_parameters`, action.payload).pipe(
          map((data: any) => (DatabaseActions.DatabaseValidateParametersSuccess({payload: data}))),
          catchError((err) => of(DatabaseActions.DatabaseValidateParametersError({payload: err}))),
        );
      }
    )
    )
  );

  getRelatedObjects$ = createEffect(() => this.actions$.pipe(
    ofType(DatabaseActions.DatabaseGetRelatedObjects),
    mergeMap(action =>
      this.http.get(`/api/v1/database/${action.payload}/related_objects/`).pipe(
        map((data: any) => (DatabaseActions.DatabaseGetRelatedObjectsSuccess({payload: data}))),
        catchError((err) => of(DatabaseActions.DatabaseGetRelatedObjectsError({payload: err})))
      )
    )
    )
  );

  uploadCSV$ = createEffect(() => this.actions$.pipe(
    ofType(DatabaseActions.UploadCSV),
    mergeMap(action =>
      this.http.post(`/api/v1/database/import/csv/`, action.payload).pipe(
        map((data: any) => (DatabaseActions.UploadCSVSuccess({payload: data}))),
        catchError((err) => of(DatabaseActions.UploadCSVError({payload: err})))
      )
    )
    )
  );

  UploadExcel$ = createEffect(() => this.actions$.pipe(
    ofType(DatabaseActions.UploadExcel),
    mergeMap(action =>
      this.http.post(`/api/v1/database/import/excel/`, action.payload).pipe(
        map((data: any) => (DatabaseActions.UploadExcelSuccess({payload: data}))),
        catchError((err) => of(DatabaseActions.UploadExcelError({payload: err})))
      )
    )
    )
  );

  getDatabasesCSV$ = createEffect(() => this.actions$.pipe(
    ofType(DatabaseActions.DatabasesCSV),
    mergeMap(action =>
      this.http.get(`/msi/related/csv/`).pipe(
        map((data: any) => (DatabaseActions.DatabasesCSVSuccess({payload: data}))),
        catchError((err) => of(DatabaseActions.DatabasesCSVError({payload: err})))
      )
    )
    )
  );

  getDatabasesExcel$ = createEffect(() => this.actions$.pipe(
    ofType(DatabaseActions.DatabasesExcel),
    mergeMap(action =>
      this.http.get(`/msi/related/excel/`).pipe(
        map((data: any) => (DatabaseActions.DatabasesExcelSuccess({payload: data}))),
        catchError((err) => of(DatabaseActions.DatabasesExcelError({payload: err})))
      )
    )
    )
  );

  getSchemasForCSV$ = createEffect(() => this.actions$.pipe(
    ofType(DatabaseActions.GetSchemasForCSV),
    mergeMap(action =>
      this.http.get(`/msi/related/schemas_for_csv/?id=${action.payload}`).pipe(
        map((data: any) => (DatabaseActions.GetSchemasForCSVSuccess({payload: data}))),
        catchError((err) => of(DatabaseActions.GetSchemasForCSVError({payload: err})))
      )
    )
    )
  );

  GetSchemasForExcel$ = createEffect(() => this.actions$.pipe(
    ofType(DatabaseActions.GetSchemasForExcel),
    mergeMap(action =>
      this.http.get(`/msi/related/schemas_for_excel/?id=${action.payload}`).pipe(
        map((data: any) => (DatabaseActions.GetSchemasForExcelSuccess({payload: data}))),
        catchError((err) => of(DatabaseActions.GetSchemasForExcelError({payload: err})))
      )
    )
    )
  );
}
