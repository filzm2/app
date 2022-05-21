import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as rison from 'rison';

import * as LogActions from '@store/actions/log/log.actions';

@Injectable()
export class LogEffects {
  constructor(
    private http: HttpClient,
    private actions$: Actions,
  ) { }

  getLogList$ = createEffect(() => this.actions$.pipe(
    ofType(LogActions.LogListGet),
    mergeMap((action) =>
      this.http.get(`/api/v1/log/?q=${rison.encode(action['payload'])}`).pipe(
        map((data: any) => (LogActions.LogListGetSuccess({ payload: data }))),
        catchError((err) => of(LogActions.LogListGetError({ payload: err }))),
      ),
    ),
  ));

  // createLogDetail$ = createEffect(() => this.actions$.pipe(
  //     ofType(LogActions.LogDetailCreate),
  //     mergeMap(action =>
  //       this.http.post(`/api/v1/log/`, action['body']).pipe(
  //         map((data: any) => (LogActions.LogDetailCreateSuccess({ payload: data }))),
  //         catchError((err) => of(LogActions.LogDetailCreateError({ payload: err }))),
  //       ),
  //     ),
  //   ),
  // );
}
