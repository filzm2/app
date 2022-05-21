import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, takeUntil } from 'rxjs/operators';

import { AuthService } from '@core/services/auth.service';

import { select, Store } from '@ngrx/store';
import * as appState from '@store/reducers/index';
import { UserGetError, UserGetId, UserGetSuccess } from '@store/actions/user/user.actions';
import { DatasetOwnersGet } from '@store/actions/dataset/dataset.actions';

// todo можно вытащить userId при входе, запросив (пример в DatasetOwnersGet) и там в списке будут записи вида: text: "admin user"
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  loggedSuccessURI = 'main/start-page';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService,
    private store: Store<appState.State>
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router
        .navigate([this.authenticationService.redirectLink?.[0] ?? this.loggedSuccessURI],
          {queryParams: this.authenticationService.redirectLink?.[1] ?? {}})
        .then();
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: (user) => {
          // get return url from route parameters or default to '/'
          this.store.dispatch(UserGetId());
          localStorage.setItem('username', this.f.username.value);

          this.store.pipe(select('userId')).subscribe((res: any): void => {
            if (res.data) {
              localStorage.setItem('userId', String(res.data.id));
              this.store.dispatch(UserGetSuccess({ payload: user }));
            }
          });

          if (location.search) {
            // ex: c=19:269
            const [, dashboardId, chartId] = location.search.match(/^\?c=(\d+):(\d+)$/) || [];

            if (dashboardId) {
              /* @ts-ignore */
              window.dashboardIdChartId = chartId;

              this.router.navigate([`/main/dashboard/${dashboardId}`], {
                queryParams: { c: `${dashboardId}:${chartId}` },
              });
            }
          } else {
            this.router
              .navigate([this.authenticationService.redirectLink?.[0] ?? this.loggedSuccessURI],
                {queryParams: this.authenticationService.redirectLink?.[1] ?? {}})
              .then();

            this.authenticationService.redirectLink = null;
          }
        },
        error(error) {
          this.store.dispatch(UserGetError({ payload: error }));
          this.error = error;
          this.loading = false;
        },
      });
  }
}
