import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as rison from 'rison';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of, timer} from 'rxjs';
import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';
import * as ChartActions from '@store/actions/chart/chart.actions';

@Injectable()
export class ChartEffects {
  constructor(private http: HttpClient, private actions$: Actions) {
  }

  getChartList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartListGet),
      mergeMap((action) =>
        this.http.get(`/api/v1/chart/?q=${rison.encode(action['payload'])}`).pipe(
          map((data: any) => ChartActions.ChartListGetSuccess({payload: data})),
          catchError((err) => of(ChartActions.ChartListGetError({payload: err})))
        )
      )
    )
  );

  getChartMSList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartListMSGet),
      mergeMap((action) =>
        this.http.get(`/ms/api/v1/chart/?q=${rison.encode(action['payload'])}`).pipe(
          map((data: any) => ChartActions.ChartListGetMSSuccess({payload: data})),
          catchError((err) => of(ChartActions.ChartListGetMSError({payload: err})))
        )
      )
    )
  );

  getChartDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartDetailGet),
      mergeMap((action) =>
        this.http.get(`/api/v1/chart/${action['id']}?q=${rison.encode(action['q'])}`).pipe(
          map((data: any) => ChartActions.ChartDetailGetSuccess({payload: data})),
          catchError((err) => of(ChartActions.ChartDetailGetError({payload: err})))
        )
      )
    )
  );

  postChartDetailData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartDetailDataPost),
      mergeMap((action) =>
        this.http.post(`/api/v1/chart/data`, action['body']).pipe(
          map((data: any) =>
            ChartActions.ChartDetailDataPostSuccess({
              payload: data,
              chartData: action['formData'],
            })
          ),
          catchError((err) =>
            of(
              ChartActions.ChartDetailDataPostError({payload: err, chartData: action['formData']})
            )
          )
        )
      )
    )
  );

  getChartDetaiData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartDetailDataGet),
      mergeMap((action) =>
        this.http
          .get(`/api/v1/chart/${action['id']}/data/`, {
            params: action['q'],
            responseType: 'json',
          })
          .pipe(
            map((data: any) => ChartActions.ChartDetailDataGetSuccess({payload: data, id: action['id']})),
            catchError((err) => of(ChartActions.ChartDetailDataGetError({payload: err})))
          )
      )
    )
  );

  setFavoriteStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartSetFavoriteStatus),
      mergeMap((action) =>
        this.http
          .get(
            `/api/v1/chart/favorite_status/?${
              action.payload?.select ? 'select' : 'unselect'
            }&q=${rison.encode(action.payload?.data)}`
          )
          .pipe(
            map((data: any) => ChartActions.ChartSetFavoriteStatusSuccess({payload: data})),
            catchError((err) => of(ChartActions.ChartSetFavoriteStatusError({payload: err})))
          )
      )
    )
  );

  getChartDetaiDataCSV$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartDetailDataGetCSV),
      mergeMap((action) =>
        this.http
          .get(`/api/v1/chart/${action['id']}/data/`, {
            params: {format: 'csv'},
            responseType: 'blob',
          })
          .pipe(
            map((data: any) =>
              ChartActions.ChartDetailDataGetCSVSuccess({payload: data, name: action['name']})
            ),
            catchError((err) => of(ChartActions.ChartDetailDataGetCSVError({payload: err})))
          )
      )
    )
  );

  updateChartDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartDetailUpdate),
      mergeMap((action) =>
        this.http.put(`/api/v1/chart/${action['id']}`, action['payload']).pipe(
          map((data: any) => ChartActions.ChartDetailUpdateSuccess({payload: data})),
          catchError((err) => of(ChartActions.ChartDetailUpdateError({payload: err})))
        )
      )
    )
  );

  getChartRelatedOwners$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartRelatedOwners),
      mergeMap((action) =>
        this.http.get(`/api/v1/chart/related/owners?q=()`).pipe(
          map((data: any) => ChartActions.ChartRelatedOwnersSuccess({payload: data})),
          catchError((err) => of(ChartActions.ChartRelatedOwnersError({payload: err})))
        )
      )
    )
  );

  getChartRelatedCreators$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartRelatedCreators),
      mergeMap((action) =>
        this.http.get(`/api/v1/chart/related/created_by?q=()`).pipe(
          map((data: any) => ChartActions.ChartRelatedCreatorsSuccess({payload: data})),
          catchError((err) => of(ChartActions.ChartRelatedCreatorsError({payload: err})))
        )
      )
    )
  );

  getChartRelatedVizTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartRelatedVizTypes),
      mergeMap((action) =>
        this.http.get(`/ms/api/v1/chart/viz_type`).pipe(
          map((data: any) => ChartActions.ChartRelatedVizTypesSuccess({payload: data})),
          catchError((err) => of(ChartActions.ChartRelatedVizTypesError({payload: err})))
        )
      )
    )
  );

  getChartRelatedDatasets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartRelatedDatasets),
      mergeMap((action) =>
        this.http
          .get(
            `/api/v1/dataset/?q=(columns:!(datasource_name,datasource_id),keys:!(none),order_column:table_name,order_direction:asc,page:${action.payload})`
          )
          .pipe(
            map((data: any) => ChartActions.ChartRelatedDatasetsSuccess({payload: data})),
            catchError((err) => of(ChartActions.ChartRelatedDatasetsError({payload: err})))
          )
      )
    )
  );

  chartDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartDelete),
      mergeMap((action) =>
        this.http.delete(`/api/v1/chart/?q=${rison.encode(action.payload)}`).pipe(
          map((data: any) => ChartActions.ChartDeleteSuccess({payload: data})),
          catchError((err) => of(ChartActions.ChartDeleteError({payload: err})))
        )
      )
    )
  );

  getPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartGetPermissions),
      mergeMap((action) =>
        this.http.get(`/api/v1/chart/_info?q=${rison.encode(action['payload'])}`).pipe(
          map((data: any) =>
            ChartActions.ChartGetPermissionsSuccess({payload: {...data, id: action.payload}})
          ),
          catchError((err) => of(ChartActions.ChartGetPermissionsError({payload: err})))
        )
      )
    )
  );

  getFavoriteStatusList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartListGetSuccess),
      mergeMap((action) => {
        if (!action.payload.ids.length) {
          return of(ChartActions.ChartGetFavoriteStatusSuccess({payload: {result: []}}));
        }
        return this.http
          .get(`/api/v1/chart/favorite_status/?q=${rison.encode(action.payload.ids)}`)
          .pipe(
            map((data: any) => ChartActions.ChartGetFavoriteStatusSuccess({payload: data})),
            catchError((err) => of(ChartActions.ChartGetFavoriteStatusError({payload: err})))
          );
      })
    )
  );

  getFavoriteStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartGetFavoriteStatus),
      mergeMap((action) =>
        this.http.get(`/api/v1/chart/favorite_status/?q=${rison.encode(action.payload.ids)}`).pipe(
          map((data: any) => ChartActions.ChartGetFavoriteStatusSuccess({payload: data})),
          catchError((err) => of(ChartActions.ChartGetFavoriteStatusError({payload: err})))
        )
      )
    )
  );

  chartCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartCreate),
      mergeMap((action) =>
        this.http
          .post(
            `/api/v1/chart/explore/?action=saveas&slice_name=${action.payload.name}&save_to_dashboard_id`,
            action.payload.data
          )
          .pipe(
            map((data: any) => ChartActions.ChartCreateSuccess({payload: data})),
            catchError((err) => of(ChartActions.ChartCreateError({payload: err})))
          )
      )
    )
  );

  addDashboardToChart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartAddDashboard),
      mergeMap((action) =>
        this.http
          .post(
            `/api/v1/chart/${action['payload']['chartId']}/add_dashboard/${action['payload']['dashboardId']}`,
            {}
          )
          .pipe(
            map((data: any) => ChartActions.ChartAddDashboardSuccess({payload: data})),
            catchError((err) => of(ChartActions.ChartAddDashboardError({payload: err})))
          )
      )
    )
  );

  deleteDashboardFromChart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartDeleteDashboard),
      mergeMap((action) =>
        this.http
          .post(
            `/api/v1/chart/${action['payload']['chartId']}/delete_dashboard/${action['payload']['dashboardId']}`,
            {}
          )
          .pipe(
            map((data: any) => ChartActions.ChartDeleteDashboardSuccess({payload: data})),
            catchError((err) => of(ChartActions.ChartDeleteDashboardError({payload: err})))
          )
      )
    )
  );

  getChartExploreJSON$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartExploreJSONGet),
      mergeMap((action) =>
        this.http.get(`/api/v1/chart/explore_json/?form_data={"slice_id":${action['id']}}`, {headers: {'Allow-Error': '1'}}).pipe(
          map((data: any) => ChartActions.ChartDetailDataGetSuccess({payload: data, id: action['id']})),
          catchError((err) => of(ChartActions.ChartDetailDataGetSuccess({payload: err, id: action['id']})))
        )
      )
    )
  );

  postChartExploreJSON$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartExploreJSONPost),
      mergeMap((action) =>
        this.http.post(`/api/v1/chart/explore_json/?form_data={"slice_id":${action.payload.id}}`, action.payload.body, {headers: {'Allow-Error': '1'}}).pipe(
          map((data: any) => ChartActions.ChartDetailDataGetSuccess({payload: data, id: action['id']})),
          catchError((err) => of(ChartActions.ChartDetailDataGetSuccess({payload: err, id: action['id']})))
        )
      )
    )
  );

  postSaveChartExploreJSON$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartExplorePostSave),
      mergeMap((action) =>
        this.http.post(`/api/v1/chart/explore/?form_data=%7B%22slice_id%22:${action.payload.id
        }%7D&slice_id=${action.payload.id}&action=overwrite&slice_name=${action.payload.name}&save_to_dashboard_id`, action.payload.body).pipe(
          map((data: any) => ChartActions.ChartSaveDetailDataGetSuccess({payload: data})),
          catchError((err) => of(ChartActions.ChartExploreJSONPostError({payload: err})))
        )
      )
    )
  );

  getChartFull$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChartActions.ChartGetFull),
      mergeMap((action) => this.http.post(`/api/v1/chart/data?form_data={slice_id:${action.payload.id}}`, action.payload.body)
        .pipe(
          switchMap((fullData) => {
              const newBody = {...action.payload.body};
              newBody.result_type = 'results';
              return this.http.post(`/api/v1/chart/data?form_data={slice_id:${action.payload.id}}`, newBody)
                .pipe(
                  map((resultData: any) =>
                    ChartActions.ChartGetFullSuccess(
                      {
                        payload: {
                          ...fullData,
                          data: resultData?.data
                        }
                      }
                    )
                  ),
                  catchError((err) =>
                    of(
                      ChartActions.ChartGetFullError({payload: err})
                    )
                  )
                )
            }
          )
        )
      ),
    )
  );
}
