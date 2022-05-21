import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, debounceTime } from 'rxjs/operators';

import * as TimeRangeActions from '@store/actions/timerange/timerange.actions';

import * as rison from 'rison';

@Injectable()
export class TimerangeEffects {
  constructor(
    private http: HttpClient,
    private actions$: Actions
  ) {
  }

  getTimerange$ = createEffect(() => this.actions$.pipe(
      ofType(TimeRangeActions.TimeRangeGet),
      mergeMap(action =>
        this.http.get(`/api/v1/time_range/?q=${rison.encode(action['payload'])}`).pipe(
          map((data: any) => (TimeRangeActions.TimeRangeGetSuccess({ payload: data }))),
          catchError((err) => of(TimeRangeActions.TimeRangeGetError({ payload: err })))
        )
      )
    )
  );
}