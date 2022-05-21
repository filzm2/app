import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import * as UserActions from '@store/actions/user/user.actions';

@Injectable()
export class UserEffects {
  constructor(private http: HttpClient, private actions$: Actions) {}

  getUserId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.UserGetId),
      mergeMap(() =>
        this.http.get(`/ms/api/v1/user/get_id`).pipe(
          map((data: any) => UserActions.UserGetIdSuccess({ payload: data })),
          catchError((err) => of(UserActions.UserGetIdError({ payload: err })))
        )
      )
    )
  );

  // todo
  getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.UserGet),
      mergeMap((action) =>
        // todo вынимать из action
        this.http.get(`/api/user/${localStorage.getItem('userId')}`).pipe(
          map((data: any) => UserActions.UserGetIdSuccess({ payload: data })),
          catchError((err) => of(UserActions.UserGetIdError({ payload: err })))
        )
      )
    )
  );

  getStartCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.CurrentUserGet),
      mergeMap(() =>
        this.http.get('/ms/api/v1/user/user_info/').pipe(
          map((data: any) => UserActions.CurrentUserGetSuccess({ payload: data })),
          catchError((err) => of(UserActions.CurrentUserGetError({ payload: err })))
        )
      )
    )
  );
}
