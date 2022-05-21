import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as rison from 'rison';
import * as DatasetActions from '@store/actions/dataset/dataset.actions';

// import { AuthService } from '@core/services/auth.service';

@Injectable()
export class DatasetEffects {
  constructor(
    private http: HttpClient,
    private actions$: Actions,
    // private authenticationService: AuthService
  ) { }

  getDataset$ = createEffect(() => this.actions$.pipe(
    ofType(DatasetActions.DatasetGet),
    mergeMap(({ payload }) => this.http.get(`/api/v1/dataset/${payload.datasetId}`).pipe(
      map((data: any) => (DatasetActions.DatasetGetSuccess({ payload: data }))),
      catchError((err) => of(DatasetActions.DatasetGetError({ payload: err }))),
    )),
  ));

  getDatasetList$ = createEffect(() => this.actions$.pipe(
    ofType(DatasetActions.DatasetListGet),
    mergeMap((action) => this.http.get(`/api/v1/dataset/?q=${rison.encode(action['payload'])}`).pipe(
      map((data: any) => (DatasetActions.DatasetListGetSuccess({ payload: data }))),
      catchError((err) => of(DatasetActions.DatasetListGetError({ payload: err }))),
    )),
  ));

  datasetClear$ = createEffect(() => this.actions$.pipe(
    ofType(DatasetActions.DatasetClear),
    mergeMap(({ payload }) => this.http.delete(`/api/v1/dataset/${payload.datasetId}`).pipe(
      map((data: any) => (DatasetActions.DatasetClearSuccess({ payload: data }))),
      catchError((err) => of(DatasetActions.DatasetClearError({ payload: err }))),
    )),
  ));

  getDatasetOwners$ = createEffect(() => this.actions$.pipe(
    ofType(DatasetActions.DatasetOwnersGet),
    mergeMap((action) => this.http.get(`/api/v1/dataset/related/owners?q=${rison.encode(action['payload'])}`).pipe(
      map((data: any) => (DatasetActions.DatasetOwnersGetSuccess({ payload: data }))),
      catchError((err) => of(DatasetActions.DatasetOwnersGetError({ payload: err }))),
    )),
  ));

  getDatasetDatabases$ = createEffect(() => this.actions$.pipe(
    ofType(DatasetActions.DatasetDatabasesGet),
    mergeMap(() => this.http.get(`/api/v1/dataset/related/database?q=()`).pipe(
      map((data: any) => (DatasetActions.DatasetDatabasesGetSuccess({ payload: data }))),
      catchError((err) => of(DatasetActions.DatasetDatabasesGetError({ payload: err }))),
    )),
  ));

  getDatasetSchema$ = createEffect(() => this.actions$.pipe(
    ofType(DatasetActions.DatasetSchemaGet),
    mergeMap(({ payload }) => this.http.get(`/api/v1/database/${payload.database}/schemas/?q=(force:!f)`).pipe(
      map((data: any) => (DatasetActions.DatasetSchemaGetSuccess({ payload: data }))),
      catchError((err) => of(DatasetActions.DatasetSchemaGetError({ payload: err }))),
    )),
  ));

  getAllDatasetSchema$ = createEffect(() => this.actions$.pipe(
    ofType(DatasetActions.DatasetAllSchemaGet),
    mergeMap(() => this.http.get(`/api/v1/dataset/distinct/schema?q=()`).pipe(
      map((data: any) => (DatasetActions.DatasetAllSchemaGetSuccess({ payload: data }))),
      catchError((err) => of(DatasetActions.DatasetAllSchemaGetError({ payload: err }))),
    )),
  ));

  saveDataset$ = createEffect(() => this.actions$.pipe(
    ofType(DatasetActions.DatasetSave),
    mergeMap(({ payload }) => this.http.post(`/api/v1/dataset/${payload.id}/save`, payload.data).pipe(
      map((data: any) => (DatasetActions.DatasetSaveSuccess({ payload: data }))),
      catchError((err) => of(DatasetActions.DatasetSaveError({ payload: err }))),
    )),
  ));

  deleteColumn$ = createEffect(() => this.actions$.pipe(
    ofType(DatasetActions.DatasetDeleteColumn),
    mergeMap(({ payload }) => this.http.delete(`/api/v1/dataset/${payload.dataset}/column/${payload.column}`).pipe(
      map((data: any) => (DatasetActions.DatasetDeleteColumnSuccess({ payload: { index: payload.index, calculated: payload.calculated } }))),
      catchError((err) => of(DatasetActions.DatasetDeleteColumnError({ payload: err }))),
    )),
  ));

  deleteMetric$ = createEffect(() => this.actions$.pipe(
    ofType(DatasetActions.DatasetDeleteMetric),
    mergeMap(({ payload }) => this.http.delete(`/api/v1/dataset/${payload.dataset}/metric/${payload.metric}`).pipe(
      map((data: any) => (DatasetActions.DatasetDeleteMetricSuccess({ payload: { index: payload.index } }))),
      catchError((err) => of(DatasetActions.DatasetDeleteMetricError({ payload: err }))),
    )),
  ));

  createDataset$ = createEffect(() => this.actions$.pipe(
    ofType(DatasetActions.DatasetCreate),
    mergeMap((action) => this.http.post(`/api/v1/dataset`, action['payload']).pipe(
      map((data: any) => (DatasetActions.DatasetCreateSuccess({ payload: data }))),
      catchError((err) => of(DatasetActions.DatasetCreateError({ payload: err }))),
    )),
  ));

  getPermissions$ = createEffect(() => this.actions$.pipe(
    ofType(DatasetActions.DatasetGetInfo),
    mergeMap(action =>
      this.http.get(`/api/v1/dataset/_info?q=${rison.encode(action['payload'])}`).pipe(
        map((data: any) => (DatasetActions.DatasetGetInfoSuccess({ payload: { ...data, id: action.payload } }))),
        catchError((err) => of(DatasetActions.DatasetGetInfoError({ payload: err })))
      )
    )
  ));

  getTables$ = createEffect(() => this.actions$.pipe(
    ofType(DatasetActions.DatasetTablesGet),
    mergeMap(action =>
      this.http.get(`/api/v1/database/${action.payload.database}/schemas/${action.payload.schema}/`).pipe(
        map((data: any) => (DatasetActions.DatasetTablesGetSuccess({ payload: data }))),
        catchError((err) => of(DatasetActions.DatasetTablesGetError({ payload: err })))
      )
    )
  ));

  syncColumns$ = createEffect(() => this.actions$.pipe(
    ofType(DatasetActions.DatasetSyncColumns),
    mergeMap(action =>
      this.http.get(`/api/v1/dataset/external_metadata_by_name/?q=${rison.encode(action['payload'])}`, { headers: { 'Allow-401': '1' } }).pipe(
        map((data: any) => (DatasetActions.DatasetSyncColumnsSuccess({ payload: data }))),
        catchError((err) => of(DatasetActions.DatasetSyncColumnsError({ payload: err })))
      )
    )
  ));
}
