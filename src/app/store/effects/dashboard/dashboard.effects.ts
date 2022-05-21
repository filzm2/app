import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as rison from 'rison';
import * as DashboardActions from '@store/actions/dashboard/dashboard.actions';

@Injectable()
export class DashboardEffects {
  constructor(private http: HttpClient, private actions$: Actions) {}

  getDashboardList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardListGet),
      mergeMap((action) => {
        return this.http.get(`/api/v1/dashboard/?q=${rison.encode(action['payload'])}`).pipe(
          map((data: any) => {
            if (action.payload.callback) {
              action.payload.callback();
            }

            return DashboardActions.DashboardListGetSuccess({ payload: data });
          }),
          catchError((err) => of(DashboardActions.DashboardListGetError({ payload: err })))
        );
      })
    )
  );

  getDashboardDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardDetailGet),
      mergeMap((action) => {
        return this.http
          .get(`/api/v1/dashboard/${action['id']}?q=${rison.encode(action['q'])}`)
          .pipe(
            map((data: any) => {
              if (action.callback) {
                action.callback(data);
              }

              return DashboardActions.DashboardDetailGetSuccess({ payload: data });
            }),
            catchError((err) => of(DashboardActions.DashboardDetailGetError({ payload: err })))
          );
      })
    )
  );

  getDashboardDetailChart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardDetailChartGet),
      mergeMap((action) =>
        this.http.get(`/api/v1/dashboard/${action['id']}/charts`).pipe(
          map((data: any) => DashboardActions.DashboardDetailChartGetSuccess({ payload: data })),
          catchError((err) => of(DashboardActions.DashboardDetailChartGetError({ payload: err })))
        )
      )
    )
  );

  createDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardCreate),
      mergeMap((action) =>
        this.http.post('/api/v1/dashboard/', action['payload']).pipe(
          map((data: any) => DashboardActions.DashboardCreateSuccess({ payload: data })),
          catchError((err) => of(DashboardActions.DashboardCreateError({ payload: err })))
        )
      )
    )
  );

  updateDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardDetailUpdate),
      mergeMap((action) =>
        this.http.put(`/api/v1/dashboard/${action['id']}`, action['payload']).pipe(
          map((data: any) => DashboardActions.DashboardDetailUpdateSuccess({ payload: data })),
          catchError((err) => of(DashboardActions.DashboardDetailUpdateError({ payload: err })))
        )
      )
    )
  );

  getDashboardRelatedOwners$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardGetRelatedOwners),
      mergeMap((action) =>
        this.http.get('/api/v1/dashboard/related/owners?q=()').pipe(
          map((data: any) => DashboardActions.DashboardGetRelatedOwnersSuccess({ payload: data })),
          catchError((err) => of(DashboardActions.DashboardGetRelatedOwnersError({ payload: err })))
        )
      )
    )
  );

  getDashboardRelatedCreators$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardGetRelatedCreators),
      mergeMap((action) =>
        this.http.get('/api/v1/dashboard/related/created_by?q=()').pipe(
          map((data: any) =>
            DashboardActions.DashboardGetRelatedCreatorsSuccess({ payload: data })
          ),
          catchError((err) =>
            of(DashboardActions.DashboardGetRelatedCreatorsError({ payload: err }))
          )
        )
      )
    )
  );

  deleteDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardDelete),
      mergeMap((action) => {
        return this.http.delete(`/api/v1/dashboard/${action.payload.id || action.payload}`).pipe(
          map((data: any) => {
            if (action.payload.callback) {
              action.payload.callback();
            }

            return DashboardActions.DashboardDeleteSuccess({ payload: data });
          }),
          catchError((err) => of(DashboardActions.DashboardDeleteError({ payload: err })))
        );
      })
    )
  );

  deleteMultipleDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardMultipleDelete),
      mergeMap((action) =>
        this.http.delete(`/api/v1/dashboard/?q=${rison.encode(action['payload'])}`).pipe(
          map((data: any) => DashboardActions.DashboardDeleteSuccess({ payload: data })),
          catchError((err) => of(DashboardActions.DashboardDeleteError({ payload: err })))
        )
      )
    )
  );

  exportDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardExport),
      mergeMap((action) =>
        this.http.get(`/api/v1/dashboard/export/?q=${rison.encode(action['payload'])}`).pipe(
          map((data: any) =>
            DashboardActions.DashboardExportSuccess({ payload: { ...data, id: action.payload } })
          ),
          catchError((err) => of(DashboardActions.DashboardExportError({ payload: err })))
        )
      )
    )
  );

  getPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardGetInfo),
      mergeMap((action) =>
        this.http.get(`/api/v1/dashboard/_info?q=${rison.encode(action['payload'])}`).pipe(
          map((data: any) =>
            DashboardActions.DashboardGetInfoSuccess({ payload: { ...data, id: action.payload } })
          ),
          catchError((err) => of(DashboardActions.DashboardGetInfoError({ payload: err })))
        )
      )
    )
  );

  dashboardOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardsOrder),
      mergeMap((action) =>
        this.http.post(`/ms/api/v1/user_dashboards/set_order_dashboards/`, action.payload).pipe(
          map((data: any) => DashboardActions.DashboardsOrderSuccess({ payload: data })),
          catchError((err) => of(DashboardActions.DashboardsOrderError({ payload: err })))
        )
      )
    )
  );

  getDashboardOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardsOrdersGet),
      mergeMap((action) =>
        this.http.get(`/ms/api/v1/user_dashboards/get_order_dashboards/`).pipe(
          map((data: any) => {
            action.payload.callback(data);
            return DashboardActions.DashboardsOrdersGetSuccess({ payload: data });
          }),
          catchError((err) => of(DashboardActions.DashboardsOrdersGetError({ payload: err })))
        )
      )
    )
  );

  getPinsDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardGetPins),
      mergeMap(() =>
        this.http.get('/ms/api/v1/user_dashboards/last_and_pinned/?count=6').pipe(
          map((data: any) => DashboardActions.DashboardGetPinsSuccess({ payload: data })),
          catchError((err) => of(DashboardActions.DashboardGetPinsError({ payload: err })))
        )
      )
    )
  );

  pinDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardPin),
      mergeMap((action) =>
        this.http
          .post(
            action.payload.isPin
              ? `/ms/api/v1/user_dashboards/pin_dashboard/${action.payload.id}/?count=6`
              : `/ms/api/v1/user_dashboards/unpin_dashboard/${action.payload.id}/`,
            {}
          )
          .pipe(
            map((data: any) => {
              if (action.payload.callback) {
                action.payload.callback();
              }

              return DashboardActions.DashboardPinSuccess({ payload: data });
            }),
            catchError((err) => {
              if (action.payload.callback) {
                action.payload.callback(err);
              }

              return of(DashboardActions.DashboardPinError({ payload: err }));
            })
          )
      )
    )
  );

  dashboardViewed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardViewed),
      mergeMap((action) =>
        this.http.post(`/ms/api/v1/user_dashboards/last_dashboard/${action.id}/`, {}).pipe(
          map((data: any) => DashboardActions.DashboardViewedSuccess({ payload: data })),
          catchError((err) => of(DashboardActions.DashboardViewedError({ payload: err })))
        )
      )
    )
  );

  setFavoriteStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardSetFavoriteStatus),
      mergeMap((action) => {
        return this.http
          .get(
            `/api/v1/dashboard/favorite_status/?${
              action.payload?.select ? 'select' : 'unselect'
            }&q=${rison.encode(action.payload?.data)}`
          )
          .pipe(
            map((data: any) => {
              if (action.payload.callback) {
                action.payload.callback();
              }

              return DashboardActions.DashboardSetFavoriteStatusSuccess({ payload: data });
            }),
            catchError((err) =>
              of(DashboardActions.DashboardSetFavoriteStatusError({ payload: err }))
            )
          );
      })
    )
  );

  // todo ??? одинаковые getFavoriteStatusList и getDashboardDetailFavoriteStatus
  // Используется на стартовой и в аналитических панелях.
  getFavoriteStatusList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardListGetSuccess),
      mergeMap((action) => {
        if (!action.payload.ids.length) {
          return of(
            DashboardActions.DashboardFavoriteStatusListGetSuccess({ payload: { result: [] } })
          );
        }
        return this.http
          .get(`/api/v1/dashboard/favorite_status/?q=${rison.encode(action.payload.ids)}`)
          .pipe(
            map((data: any) =>
              DashboardActions.DashboardFavoriteStatusListGetSuccess({ payload: data })
            ),
            catchError((err) =>
              of(DashboardActions.DashboardFavoriteStatusListGetError({ payload: err }))
            )
          );
      })
    )
  );

  // todo где используется не обнаружил
  getDashboardDetailFavoriteStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.DashboardDetailFavoriteStatusListGet),
      mergeMap((action) => {
        if (!action.payload.ids.length) {
          return of(
            DashboardActions.DashboardFavoriteStatusListGetSuccess({ payload: { result: [] } })
          );
        }
        return this.http
          .get(`/api/v1/dashboard/favorite_status/?q=${rison.encode(action.payload.ids)}`)
          .pipe(
            map((data: any) =>
              DashboardActions.DashboardFavoriteStatusListGetSuccess({ payload: data })
            ),
            catchError((err) =>
              of(DashboardActions.DashboardFavoriteStatusListGetError({ payload: err }))
            )
          );
      })
    )
  );
}
