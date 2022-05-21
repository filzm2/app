import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  TAvailableFilters,
  TRoleColumnDBName,
  TRoleColumnName,
} from '@page/content/security/security.interface';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as appState from '@store/reducers';
import { RouterStateUrl } from '@store/reducers';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DialogService } from '@core/services/dialog.service';
import { take, takeUntil } from 'rxjs/operators';
import {
  selectRoleState,
  selectRolesListState,
  selectRolePermissionsState,
} from '@store/selectors/security/security.selector';
import { AppHelpers } from '@core/helpers/app-helpers';
import * as fromRouter from '@ngrx/router-store';
import * as rison from 'rison';
import { IRole } from '@models/role/role.model';
import { RoleDelete, RoleGetInfo, RoleListGet } from '@store/actions/settings/security.actions';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['../users/users.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RolesComponent implements OnInit {
  public paginator: any = {
    count: 0,
    pageSize: 10,
    currentPage: 0,
    skip: 0,
  };
  public permissions = {
    canRead: false,
    canWrite: false,
  };
  public isLoading = false;
  public routerState: any;
  public roleList: IRole[] = [];
  public displayedColumns: TRoleColumnName[] = ['role', 'actions'];
  public sortColumn: TRoleColumnDBName = 'name';
  public sortOrder: 'asc' | 'desc' = 'desc';
  public filterState = [];
  public selectedFilters: TAvailableFilters[] = [];
  public availableFilters: TAvailableFilters[] = ['permissions', 'roleName', 'user'];
  private _destroy$ = new Subject<null>();
  constructor(
    private store: Store<appState.State>,
    private router: Router,
    private dialog: DialogService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.store
      .pipe(takeUntil(this._destroy$), select('router'), take(1))
      .subscribe((router) => this.initStateByUrl(router));

    this.store.pipe(takeUntil(this._destroy$), select(selectRolesListState)).subscribe((res) => {
      if (res.data) {
        this.roleList = res.data?.result ?? [];
        this.paginator.count = res.data.count || 0;
      }
      this.dialog.errorHandler(res);
      this.isLoading = false;
    });

    this.store.pipe(takeUntil(this._destroy$), select(selectRoleState)).subscribe((res) => {
      if (res.deleteSuccess) {
        this.getRoleList();
      }
    });

    this.store
      .pipe(takeUntil(this._destroy$), select(selectRolePermissionsState))
      .subscribe((res) => {
        return (this.permissions = res.data);
      });

    this.getRoleList();

    this.store.dispatch(RoleGetInfo({ payload: { keys: ['permissions'] } }));
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public onPageChange(evt: any): void {
    this.paginator.pageSize = evt.pageSize;
    this.paginator.currentPage = evt.pageIndex;
    this.paginator.skip = evt.skip;
    this.getRoleList();
  }

  public onSearch(): void {
    this.paginator.currentPage = 0;
    this.getRoleList();
  }

  public getSortedList(column: TRoleColumnDBName): void {
    if (column === this.sortColumn) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.getRoleList();
  }

  public editRole(role: IRole): void {
    if (this.permissions.canWrite) {
      this.router.navigate(['/main/security/roles/edit', role.id]).then();
    }
  }

  public getCountRoleLabel(): string {
    return `${this.paginator.count} ${AppHelpers.getDeclensionForm(this.roleList.length, [
      'роль',
      'роли',
      'ролей',
    ])}`;
  }

  public deleteRole(id: number): void {
    this.store.dispatch(RoleDelete({ payload: id }));
  }

  public createRole(): void {
    if (this.permissions.canWrite) {
      this.router.navigate(['/main/security/roles/add']).then();
    }
  }

  private initStateByUrl(router: fromRouter.RouterReducerState<RouterStateUrl>): void {
    const queryParams = router?.state?.queryParams;
    const queryParamsKeys = Object.keys(queryParams);
    if (queryParamsKeys.length) {
      queryParamsKeys.forEach((item) => {
        switch (item) {
          case 'sortColumn':
          case 'sortOrder':
            this[item as any] = queryParams[item];
            break;
          case 'pageIndex':
            this.paginator.currentPage = +queryParams[item];
            break;
          case 'filters':
            const filters: any = rison.decode(queryParams[item]);
            if (filters) {
              const filterState = [];
              Object.keys(filters).forEach((filter) => {
                filterState.push(filters[filter]);
                this.selectedFilters.push(filters[filter].key);
              });
              this.filterState = filterState;
            }
            break;
        }
      });
    }
    this.routerState = router;
  }

  private getRoleList(): void {
    this.store.dispatch(
      RoleListGet({
        payload: {
          filters: this.filterState,
          order_column: this.sortColumn,
          order_direction: this.sortOrder,
          page: this.paginator.currentPage,
          page_size: this.paginator.pageSize,
        },
      })
    );
    this.setQueryParams();
    this.isLoading = true;
  }

  private setQueryParams(): void {
    const filters = {};
    Object.keys(this.filterState).forEach((key) => {
      if (this.filterState[key] !== null) {
        filters[key] = this.filterState[key];
      }
    });
    const queryParams: Params = {
      filters: rison.encode(filters),
      sortColumn: this.sortColumn,
      sortOrder: this.sortOrder,
      pageIndex: this.paginator.currentPage,
    };
    this.router
      .navigate([], {
        queryParams,
        relativeTo: this.activatedRoute,
        queryParamsHandling: 'merge',
      })
      .then();
  }

  getFilteredData(filters: any): void {
    this.paginator.currentPage = 0;
    this.filterState = filters;
    this.getRoleList();
  }
}
