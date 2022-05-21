import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import * as DashboardCommentsActions from '@store/actions/dashboard/dashboard-comments.actions';

@Injectable()
export class DashboardCommentsEffects {
  constructor(private http: HttpClient, private actions$: Actions) {}

  getDashboardCommentsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardCommentsActions.DashboardChartCommentsGet),
      mergeMap((action) => {
        return this.http
          .get(`/ms/api/v1/comment/dashboard/${action['dashboardId']}/chart/${action['chartId']}/`)
          .pipe(
            map((data: any) => {
              if (action.callback) {
                action.callback(data);
              }

              return DashboardCommentsActions.DashboardChartCommentsGetSuccess({ payload: data });
            }),
            catchError((err) =>
              of(DashboardCommentsActions.DashboardChartCommentsGetError({ payload: err }))
            )
          );
      })
    )
  );

  postDashboardComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardCommentsActions.DashboardChartCommentsPost),
      mergeMap((action) =>
        this.http
          .post(
            `/ms/api/v1/comment/dashboard/${action['dashboardId']}/chart/${action['chartId']}/`,
            action['payload'],
            { responseType: 'text' }
          )
          .pipe(
            map((data: any) =>
              DashboardCommentsActions.DashboardChartCommentsPostSuccess({ payload: data })
            ),
            catchError((err) =>
              of(DashboardCommentsActions.DashboardChartCommentsPostError({ payload: err }))
            )
          )
      )
    )
  );

  updateDashboardComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardCommentsActions.DashboardChartCommentsPut),
      mergeMap((action) =>
        this.http
          .put(
            `/ms/api/v1/comment/dashboard/${action['dashboardId']}/chart/${action['chartId']}/ `,
            action['payload'],
            { responseType: 'text' }
          )
          .pipe(
            map((data: any) =>
              DashboardCommentsActions.DashboardChartCommentsGet({
                dashboardId: action['dashboardId'],
                chartId: action['chartId'],
              })
            ),
            catchError((err) =>
              of(DashboardCommentsActions.DashboardChartCommentsPutError({ payload: err }))
            )
          )
      )
    )
  );

  deleteDashboardComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardCommentsActions.DashboardChartCommentsDelete),
      mergeMap((action) =>
        this.http
          .request(
            'delete',
            `/ms/api/v1/comment/dashboard/${action['dashboardId']}/chart/${action['chartId']}/`,
            { body: action['payload'], responseType: 'text' }
          )
          .pipe(
            map((data: any) =>
              DashboardCommentsActions.DashboardChartCommentsDeleteSuccess({
                payload: data,
              })
            ),
            catchError((err) =>
              of(DashboardCommentsActions.DashboardChartCommentsDeleteError({ payload: err }))
            )
          )
      )
    )
  );

  getDashboardCommentsListAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardCommentsActions.DashboardCommentsGet),
      mergeMap((action) =>
        this.http.get(`/ms/api/v1/comment/dashboard/${action['dashboardId']}/count`).pipe(
          map((data: any) =>
            DashboardCommentsActions.DashboardCommentsGetSuccess({ payload: data })
          ),
          catchError((err) =>
            of(DashboardCommentsActions.DashboardCommentsGetError({ payload: err }))
          )
        )
      )
    )
  );
}
