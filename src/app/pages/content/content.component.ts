import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as appState from '@store/reducers/index';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  DashboardClear,
  DashboardCreate,
  DashboardCreatedClear,
} from '@app/store/actions/dashboard/dashboard.actions';
import { selectAllPermissions } from '@store/selectors/security/security.selector';
import { GetAllPermissions, UserGetAllPermissions } from '@store/actions/settings/security.actions';
import { IAllPermissions } from '@models/role/role.model';
//import { ChartClear } from '@app/store/actions/chart/chart.actions';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit, OnDestroy {
  private _destroy$ = new Subject<null>();
  private intervalId: any;
  public isOpenedMobileMenu = false;
  public permissions: IAllPermissions = {};

  constructor(
    private authenticationService: AuthService,
    private store: Store<appState.State>,
    private router: Router
  ) {}

  ngOnInit(): void {
    // let test = this.authenticationService.refresh();
    this.intervalId = setInterval(() => {
      this.authenticationService.refresh();
    }, 60000);

    this.store.pipe(takeUntil(this._destroy$), select('dashboardCreate')).subscribe((res) => {
      if (res.data?.id && res.created) {
        // this.store.dispatch(DashboardClear());
        // this.store.dispatch(ChartClear());
        this.store.dispatch(DashboardCreatedClear());
        this.router.navigate([`/main/dashboard/`]).then(() => {
          this.router.navigate([`/main/dashboard/edit/${res.data.id}/`]).then();
        });
      }
    });

    this.store.pipe(takeUntil(this._destroy$), select('common')).subscribe(({ data }) => {
      this.isOpenedMobileMenu = data.isHeaderMobileMenuShowed;
    });

    this.store.pipe(takeUntil(this._destroy$), select(selectAllPermissions)).subscribe((res) => {
      if (res.data) {
        this.permissions = res.data;
      }
    });

    this.store.dispatch(UserGetAllPermissions());
  }

  async datasetAdd(): Promise<void> {
    await this.router.navigate(['/content/dataset/dataset-add']);
  }

  logoutClick(): void {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  createDashboard(): void {
    this.store.dispatch(
      DashboardCreate({
        payload: {
          dashboard_title: 'Безымянная аналитическая панель',
        },
      })
    );
  }

  createDataset(): void {
    this.router.navigate(['/main/dataset/add']).then();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this._destroy$.next();
    this._destroy$.complete();
    // this.store.dispatch(DashboardClear());
  }
}
