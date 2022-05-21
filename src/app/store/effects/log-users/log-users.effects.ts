import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as rison from 'rison';

import * as LogUsersActions from '@store/actions/log-users/log-users.actions';

@Injectable()
export class LogUsersEffects {
  constructor(
    private http: HttpClient,
    private actions$: Actions,
  ) { }

  getLogUsersList$ = createEffect(() => this.actions$.pipe(
    ofType(LogUsersActions.LogUsersListGet),
    mergeMap((action) =>
      this.http.get(`/ms/api/v1/user/related/changed_by?q=${rison.encode(action['payload'])}`).pipe(
        map((data: any) => (LogUsersActions.LogUsersListGetSuccess({ payload: data }))),
        catchError((err) => of(LogUsersActions.LogUsersListGetError({ payload: err }))),
      ),
    ),
  ));
}
