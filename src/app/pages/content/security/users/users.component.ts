import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { take, takeUntil } from "rxjs/operators";
import { select, Store } from "@ngrx/store";
import {
  IUserInfoDatasource,
  TAvailableFilters,
  TUserColumnDBName,
  TUserColumnName
} from "@page/content/security/security.interface";
import { Subject } from "rxjs";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DialogService } from "@core/services/dialog.service";
import {
  selectSettingsPermissionsState,
  selectUserListState,
  selectUserPermissionsState
} from "@store/selectors/security/security.selector";
import * as appState from '@store/reducers/index';
import * as rison from 'rison';
import * as fromRouter from '@ngrx/router-store';
import { UserDelete, UserGetInfo, UserListGet } from "@store/actions/settings/security.actions";
import { RouterStateUrl } from "@store/reducers/index";
import { AppHelpers } from "@core/helpers/app-helpers";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UsersComponent implements OnInit {

  public paginator: any = {
    count: 0,
    pageSize: 10,
    currentPage: 0,
    skip: 0
  };
  public permissions = {
    canRead: false,
    canWrite: false,
  };
  public isLoading = false;
  public routerState: any;
  public userList: IUserInfoDatasource[] = [];
  public displayedColumns: TUserColumnName[] = [ 'fullName', 'email', 'formatRoles', 'activity', 'actions' ];
  public sortColumn: TUserColumnDBName = 'last_name';
  public sortOrder: 'asc' | 'desc' = 'desc';
  public filterState = [];
  public availableFilters: TAvailableFilters[] = ['role', 'created', 'changed', 'name', 'surname', 'login', 'status', 'email', 'lastLogin', 'loginCount', 'errorCount', 'createdDate', 'changedDate'];
  public selectedFilters: TAvailableFilters[] = [];
  private _destroy$ = new Subject<null>();
  private filtersOptions: { [key: string]: { operation: string, column: string } } = {};
  private filledCardList = ['Admin'];
  private userCount: number = 0;
  constructor(
    private store: Store<appState.State>,
    private router: Router,
    private dialog: DialogService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.store.pipe(takeUntil(this._destroy$), select('router'), take(1))
      .subscribe(router => this.initStateByUrl(router));

    this.store.pipe(takeUntil(this._destroy$), select(selectUserPermissionsState)).subscribe(res => {
      if (res.data) {
        this.permissions = res.data;
      }
    })

    this.store.pipe(takeUntil(this._destroy$), select(selectUserListState))
      .subscribe((res) => {
        if (res.needUpdate) {
          this.getUserList();
          return;
        }
        if (res.data) {
          const list: IUserInfoDatasource[] = [];
          res.data.result?.forEach(user => {
            const formatRoles = [];
            let restRoles = '';
            let restRoleCount = 0;
            user.roles.forEach((role, i) => {
              if(i < 3) {
                formatRoles.push({
                  name: role,
                  filled: this.filledCardList.includes(role),
                });
                return;
              }
              restRoles += `${role}\n`;
              restRoleCount++;
            })
            list.push({
              ...user,
              fullName: `${user.lastName} ${user.firstName}`,
              formatRoles: formatRoles,
              restRoles: {
                text: restRoles,
                count: restRoleCount,
              }
            })
          })
          this.userList = list;
          this.paginator.count = this.userCount = res.data.count || 0;
        }
        this.dialog.errorHandler(res);
        this.isLoading = false;
      });

    this.store.pipe(takeUntil(this._destroy$), select(selectSettingsPermissionsState))
      .subscribe((res) => this.permissions = {canRead: true, canWrite: true});

    this.getUserList();

    this.store.dispatch(UserGetInfo({payload: {keys: 'permission'}}));
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public onPageChange(evt: any): void {
    this.paginator.pageSize = evt.pageSize;
    this.paginator.currentPage = evt.pageIndex;
    this.paginator.skip = evt.skip;
    this.getUserList();
  }

  public onSearch(): void {
    this.paginator.currentPage = 0;
    this.getUserList();
  }

  public getSortedList(column: TUserColumnDBName): void {
    if (column === this.sortColumn) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.getUserList();
  }

  public editUser(user: IUserInfoDatasource): void {
    if (this.permissions.canWrite) {
      this.router.navigate([ '/main/security/users/edit', user.id ]).then();
    }
  }

  public getCountUserLabel(): string {
    return `${this.userCount} ${AppHelpers.getDeclensionForm(this.userList.length, [ 'пользователь', 'пользователя', 'пользователей' ])}`;
  }

  public deleteUser(id: number): void {
    this.store.dispatch(UserDelete({payload: id}));
  }

  public createUser(): void {
    if (this.permissions.canWrite) {
      this.router.navigate([ '/main/security/users/add' ]).then();
    }
  }

  public getFilteredData(filters): void {
    this.paginator.currentPage = 0;
    this.filterState = filters;
    this.getUserList();
  }

  public getRestRoleText(count: number): string {
    return AppHelpers.getDeclensionForm(count,['роль', 'роли', 'ролей']);
  }

  private initStateByUrl(router: fromRouter.RouterReducerState<RouterStateUrl>): void {
    const queryParams = router?.state?.queryParams;
    const queryParamsKeys = Object.keys(queryParams);
    if (queryParamsKeys.length) {
      queryParamsKeys.forEach(item => {
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
              Object.keys(filters).forEach(filter => {
                filterState.push(filters[filter]);
                this.selectedFilters.push(filters[filter].key);
              })
              this.filterState = filterState;
            }
            break;
        }
      });
    }
    this.routerState = router;
  }

  private getUserList(): void {
    this.store.dispatch(UserListGet({
      payload: {
        filters: this.filterState,
        order_column: this.sortColumn,
        order_direction: this.sortOrder,
        page: this.paginator.currentPage,
        page_size: this.paginator.pageSize
      } }));
    this.setQueryParams();
    this.isLoading = true;
  }

  private setQueryParams(): void {
    const filters = {};
    Object.keys(this.filterState).forEach(key => {
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
    this.router.navigate(
      [],
      {
        queryParams,
        relativeTo: this.activatedRoute,
        queryParamsHandling: 'merge',
      }).then();
  }

}
