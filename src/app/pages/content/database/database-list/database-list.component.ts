import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { RouterStateUrl } from '@app/store';
import { State as databaseState } from '@store/reducers/database/database-list.reducer';
import * as appState from '@store/reducers/index';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import moment from 'moment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import * as rison from 'rison';
import * as fromRouter from '@ngrx/router-store';
import { TDatabaseColumnName } from '@page/content/database/database-list/database-list.interface';
import { IDatabase } from '@models/database/database.model';
import {
  DatabaseDelete,
  DatabaseGetInfo,
  DatabaseListGet,
} from '@store/actions/database/database.actions';
import { selectDatabasePermissionsState } from '@store/selectors/database/database.selector';
import { DialogService } from '@core/services/dialog.service';
import { DatabaseDeletePopupComponent } from '@page/content/database/components/database-delete-popup/database-delete-popup.component';

@Component({
  selector: 'app-database-list',
  templateUrl: './database-list.component.html',
  styleUrls: ['./database-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DatabaseListComponent implements OnInit, OnDestroy {
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
  public databaseList: IDatabase[];
  public displayedColumns: TDatabaseColumnName[] = [
    'database_name',
    'backend',
    'allow_run_async',
    'allow_dml',
    'allow_csv_upload',
    'expose_in_sqllab',
    'changed_on_delta_humanized',
    'created_by',
    'actions',
  ];
  public sortColumn: TDatabaseColumnName = 'changed_on_delta_humanized';
  public sortOrder: 'asc' | 'desc' = 'desc';
  private _destroy$ = new Subject<null>();
  public filterState = {
    expose_in_sqllab: null,
    allow_run_async: null,
    database_name: null,
    allow_csv_upload: null,
    allow_dml: null,
  };
  private filtersOptions: { [key: string]: { operation: string; column: string } } = {
    expose_in_sqllab: { operation: 'eq', column: 'expose_in_sqllab' },
    allow_run_async: { operation: 'eq', column: 'allow_run_async' },
    allow_csv_upload: { operation: 'eq', column: 'allow_csv_upload' },
    allow_dml: { operation: 'eq', column: 'allow_dml' },
    database_name: { operation: 'ct', column: 'database_name' },
  };

  constructor(
    private store: Store<appState.State>,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.store
      .pipe(takeUntil(this._destroy$), select('router'), take(1))
      .subscribe((router) => this.initStateByUrl(router));

    this.store
      .pipe(takeUntil(this._destroy$), select('databaseList'))
      .subscribe((res) => this.initDatabaseList(res));

    this.store
      .pipe(takeUntil(this._destroy$), select(selectDatabasePermissionsState))
      .subscribe((res) => (this.permissions = res.data));

    this.getDatabaseList();

    this.store.dispatch(DatabaseGetInfo({ payload: { keys: ['permissions'] } }));
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public onPageChange(evt: any): void {
    this.paginator.pageSize = evt.pageSize;
    this.paginator.currentPage = evt.pageIndex;
    this.paginator.skip = evt.skip;
    this.getDatabaseList();
  }

  public onSearch(): void {
    this.paginator.currentPage = 0;
    this.getDatabaseList();
  }

  public getSortedList(column: TDatabaseColumnName): void {
    if (column === this.sortColumn) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.getDatabaseList();
  }

  public editDatabase(database: IDatabase): void {
    if (this.permissions.canRead) {
      this.router.navigate(['/main/database/edit', database.id]).then();
    }
  }

  public deleteDatabase(database: IDatabase): void {
    this.dialog
      .open(DatabaseDeletePopupComponent, {
        data: { id: database.id, name: database.database_name },
        width: '481px',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.store.dispatch(DatabaseDelete({ payload: database.id }));
        }
      });
  }

  private initDatabaseList(res: databaseState): void {
    if (res.needUpdate) {
      this.getDatabaseList();
      return;
    }
    if (res.data) {
      const list = [];
      res.data.result.forEach((item) => {
        list.push({
          ...item,
          // todo нужна доработка на бэке, приходит корявый utc с часовым поясом -0800, без явного указания
          changed_on: moment(moment.utc(moment(item.changed_on).add(8, 'hours')))
            .local()
            .format('DD.MM.YY HH:mm'),
        });
      });
      this.databaseList = list;
      this.paginator.count = res.data.count;
    }
    this.dialogService.errorHandler(res);
    this.isLoading = false;
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
              Object.keys(filters).forEach((filter) => {
                this.filterState[filter] = filters[filter];
              });
            }
            break;
        }
      });
    }
    this.routerState = router;
  }

  private getDatabaseList(): void {
    this.store.dispatch(
      DatabaseListGet({
        payload: {
          filters: this.getFilters(),
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
}
