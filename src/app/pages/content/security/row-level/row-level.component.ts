import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IRowLevelDatasource, TAvailableFilters, TRowLevelColumnName } from "@page/content/security/security.interface";
import { Subject } from "rxjs";
import { select, Store } from "@ngrx/store";
import * as appState from "@store/reducers";
import { RouterStateUrl } from "@store/reducers";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DialogService } from "@core/services/dialog.service";
import { take, takeUntil } from "rxjs/operators";
import { selectRowLevelListState, selectSettingsPermissionsState } from "@store/selectors/security/security.selector";
import { AppHelpers } from "@core/helpers/app-helpers";
import * as fromRouter from "@ngrx/router-store";
import * as rison from "rison";
import { RowLevelListGet } from "@store/actions/settings/security.actions";
import { IRowLevel } from "@models/row-level/row-level.model";
import { IDashboard } from "@models/dashboard/dashboard.model";

@Component({
  selector: 'app-row-level',
  templateUrl: './row-level.component.html',
  styleUrls: ['../users/users.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RowLevelComponent implements OnInit {

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
  public rowLevelList: IRowLevelDatasource[] = [];
  public displayedColumns: TRowLevelColumnName[] = [ 'checkboxes', 'tables', 'condition', 'group_key', 'roles', 'author', 'changed_on', 'actions' ];
  public sortColumn: TRowLevelColumnName = 'changed_on';
  public sortOrder: 'asc' | 'desc' = 'desc';
  public filterState = {};
  public availableFilters: TAvailableFilters[] = ['table', 'roles_includes', 'roles_excludes', 'group_key', 'condition'];
  public currentSelect: number[] = [];
  private _destroy$ = new Subject<null>();
  private filtersOptions: { [key: string]: { operation: string, column: string } } = {};
  private filledCardList = ['Admin'];
  constructor(
    private store: Store<appState.State>,
    private router: Router,
    private dialog: DialogService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.store.pipe(takeUntil(this._destroy$), select('router'), take(1))
      .subscribe(router => this.initStateByUrl(router));

    this.store.pipe(takeUntil(this._destroy$), select(selectRowLevelListState))
      .subscribe((res) => {
        if (res.data) {
          const list: IRowLevel[] = [];
          res.data.forEach(rl => {
            const formatRoles = [];
            let include = false;
            rl.roles_includes?.forEach(role => {
              include = true;
              formatRoles.push({
                name: role,
                filled: this.filledCardList.includes(role),
              })
            })
            rl.roles_excludes?.forEach(role => {
              formatRoles.push({
                name: role,
                filled: this.filledCardList.includes(role),
              })
            })
            list.push({
              ...rl,
              formatRoles,
              include,
              select: this.isSelectItem(rl),
            })
          })
          this.rowLevelList = list;
          this.paginator.count = res.data.count || 0;
        }
        this.dialog.errorHandler(res);
        this.isLoading = false;
      });

    this.store.pipe(takeUntil(this._destroy$), select(selectSettingsPermissionsState))
      .subscribe((res) => this.permissions = {canRead: true, canWrite: true});

    this.getRowLevelList();

    // запрос прав
    // this.store.dispatch(UserGetInfo({payload: {keys: ['permissions']}}));
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public onPageChange(evt: any): void {
    this.paginator.pageSize = evt.pageSize;
    this.paginator.currentPage = evt.pageIndex;
    this.paginator.skip = evt.skip;
    this.getRowLevelList();
  }

  public onSearch(): void {
    this.paginator.currentPage = 0;
    this.getRowLevelList();
  }

  public getSortedList(column: TRowLevelColumnName): void {
    if (column === this.sortColumn) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.getRowLevelList();
  }

  public editRowLevel(row: IRowLevel): void {
    if (this.permissions.canWrite) {
      this.router.navigate([ '/main/security/row-level/edit', row.id ]).then();
    }
  }

  public deleteRowLevel(id: number): void {
    // this.store.dispatch(UserDelete({payload: id}));
  }

  public createRowLevel(): void {
    if (this.permissions.canWrite) {
      this.router.navigate([ '/main/security/row-level/add' ]).then();
    }
  }

  public isCheckedAll(): boolean {
    return this.rowLevelList?.every((row) => row.select);
  }

  public someCheckedCurrentPage(): boolean {
    return this.rowLevelList?.some((row) => row.select);
  }

  public someCheckedAllPage(): boolean {
    return !!this.currentSelect.length;
  }

  public someButNotAtAllChecked(): boolean {
    return this.someCheckedCurrentPage() && !this.isCheckedAll();
  }

  public setAllCheckbox(checked: boolean, allPage: boolean = false): void {
    if (allPage) {
      this.currentSelect = [];
    }
    this.rowLevelList.forEach((row) => {
      row.select = checked;
      this.changeSelect(checked, row);
    });
  }

  public changeSelect(checked: boolean, dashboard: IDashboard): void {
    if (checked) {
      this.currentSelect.push(+dashboard.id);
      return
    }
    this.currentSelect = this.currentSelect.filter(id => id !== +dashboard.id)
  }

  public deleteSelectedRows(): void {

  }

  public getGroupDeleteButtonText(): string {
    const count = this.getSelectCount();
    return `${count} ${AppHelpers.getDeclensionForm(count, ['запись выделена', 'записи выделены', 'записей выделено'])}`;
  }

  private isSelectItem(dashboard: IDashboard): boolean {
    return !!~(this.currentSelect.indexOf(dashboard.id));
  }

  private getSelectCount(): number {
    return this.currentSelect.length;
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
              Object.keys(filters).forEach(filter => {
                this.filterState[filter] = filters[filter];
              });
            }
            break;
        }
      });
    }
    this.routerState = router;
  }

  private getRowLevelList(): void {
    this.store.dispatch(RowLevelListGet({
      payload: {
        filters: this.getFilters(),
        order_column: this.sortColumn,
        order_direction: this.sortOrder,
        page: this.paginator.currentPage,
        page_size: this.paginator.pageSize
      } }));
    this.setQueryParams();
    this.isLoading = true;
  }

  private getFilters(): any[] {
    const filters = [];
    Object.keys(this.filterState).forEach((key) => {
      if (this.filterState[key] !== null) {
        filters.push({
          col: this.filtersOptions[key].column,
          opr: this.filtersOptions[key].operation,
          value: this.filterState[key],
        });
      }
    });

    return filters;
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
