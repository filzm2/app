import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DashboardCreate } from '@store/actions/dashboard/dashboard.actions';
import { CommonUpdate } from '@store/actions/common/common.actions';
import { Subject } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { select, Store } from '@ngrx/store';
import * as appState from '@store/reducers';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { IAllPermissions } from '@models/role/role.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private _destroy$ = new Subject<null>();
  public isMobileMenuShowed = false;
  @Input() permissions: IAllPermissions;

  constructor(
    private authenticationService: AuthService,
    private store: Store<appState.State>,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.store.pipe(takeUntil(this._destroy$), select('common')).subscribe(({ data }) => {
      this.isMobileMenuShowed = data.isHeaderMobileMenuShowed;
    });
  }

  public createDashboard(): void {
    this.store.dispatch(
      DashboardCreate({
        payload: {
          dashboard_title: 'Безымянная аналитическая панель',
        },
      })
    );
  }

  public createDataset(): void {
    this.router.navigate(['/main/dataset/add']).then();
  }

  public createDatabase(): void {
    this.router.navigate(['/main/database/add']).then();
  }

  public createChart(): void {
    this.router.navigate(['/main/charts/add']).then();
  }

  public switchMobileMenuOpened({
    type = '',
    reset = false,
  }: {
    type?: string;
    reset?: boolean;
  }): void {
    if (reset) {
      this.store.dispatch(
        CommonUpdate({
          payload: {
            isHeaderMobileMenuShowed: false,
          },
        })
      );
    } else if (type === 'isMobileMenuShowed') {
      this.store.dispatch(
        CommonUpdate({
          payload: {
            isHeaderMobileMenuShowed: !this.isMobileMenuShowed,
          },
        })
      );
    }
  }

  public logoutClick(): void {
    this.authenticationService.logout();
    this.router.navigate(['/login/']);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
