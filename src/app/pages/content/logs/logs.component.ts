import { Component, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as appState from '@store/reducers/index';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LogListGet } from '@app/store/actions/log/log.actions';
import { LogUsersListGet } from '@app/store/actions/log-users/log-users.actions';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ILogData, LogDetailComponent } from '@page/content/logs/log-detail/log-detail.component';
import moment from 'moment';

type LogFilterType = { col: string; opr: string; value: string };
type sortColumnType = 'dttm' | 'action';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit {
  private _destroy$ = new Subject<null>();
  private routerState: any;
  public isLoading = true;
  public sortColumn: sortColumnType = 'dttm';
  public sortOrder: 'asc' | 'desc' = 'desc';

  public paginator: {
    count: number;
    pageSize: number;
    pageSizeOptions: number[];
    currentPage: number;
    skip: number;
  } = {
    count: 0,
    pageSize: 25,
    pageSizeOptions: [25, 50, 75, 100],
    currentPage: 0,
    skip: 0,
  };
  public logList = new MatTableDataSource();
  private logListData: ILogData[];
  public displayedColumns: string[] = ['select', 'action', 'username', 'timestamp'];

  public logsMenu: { key: string; title: string }[] = [
    { key: 'user', title: 'Пользователь' },
    { key: 'action', title: 'Действие' },
    { key: 'dashboard', title: 'ID Аналитической панели' },
    { key: 'widget', title: 'ID Виджета' },
    { key: 'json', title: 'JSON' },
    { key: 'date', title: 'Дата' },
    { key: 'duration', title: 'Продолжительность' },
    { key: 'link', title: 'Ссылка' },
  ];

  public filtersOptionsModel: {
    [key: string]: { key: string; inputValue: string; variant: number }[];
  } = {
    user: [], // [{ key: 'user', .. }, ..]
    action: [], // [{ key: 'action', .. }, ..]
    dashboard: [], // [{ key: 'dashboard', .. }, ..]
    widget: [], // [{ key: 'widget', .. }, ..]
    json: [], // [{ key: 'json', .. }, ..]
    date: [], // [{ key: 'date', .. }, ..]
    duration: [], // [{ key: 'duration', .. }, ..]
    link: [], // [{ key: 'link', .. }, ..]
  };

  // Operations: https://github.com/apache/superset/blob/1.2/superset-frontend/src/components/ListView/types.ts#L85
  // -1 - когда фильтр не добавлен.
  // 0 - когда фильтр добавлен, но не выбрано правило.
  // >0 - когда выбрано правило из списка.
  public filtersOptions: {
    [key: string]: { variant: number; operation: string; column: string; value: string }[];
  } = {
    // todo апи получения всех пользователей. после апи доделать выбор нескольких userId для фильтрации
    user: [
      // https://github.com/apache/superset/blob/1.2/superset-frontend/src/components/ListView/types.ts#L96
      // { variant: 1, operation: 'rel_m_m', column: 'user', value: 'Для нескольких' }, // relationManyMany [фильтр для
      // нескольких userId]
      { variant: 2, operation: 'rel_o_m', column: 'user', value: 'Для одного' }, // relationOneMany [фильтр для одного
      // userId]
    ],
    action: [
      { variant: 1, operation: 'ct', column: 'action', value: 'Содержит' },
      { variant: 2, operation: 'nct', column: 'action', value: 'Не содержит' },
    ],
    dashboard: [
      { variant: 1, operation: 'eq', column: 'dashboard_id', value: 'Равно' },
      { variant: 2, operation: 'gt', column: 'dashboard_id', value: 'Больше чем' },
      { variant: 3, operation: 'lt', column: 'dashboard_id', value: 'Меньше чем' },
      { variant: 4, operation: 'neq', column: 'dashboard_id', value: 'Не равно' },
    ],
    widget: [
      { variant: 1, operation: 'eq', column: 'slice_id', value: 'Равно' },
      { variant: 2, operation: 'gt', column: 'slice_id', value: 'Больше чем' },
      { variant: 3, operation: 'lt', column: 'slice_id', value: 'Меньше чем' },
      { variant: 4, operation: 'neq', column: 'slice_id', value: 'Не равно' },
    ],
    json: [
      { variant: 1, operation: 'sw', column: 'json', value: 'Начинается с' },
      { variant: 2, operation: 'ew', column: 'json', value: 'Оканчивается на' },
      { variant: 3, operation: 'ct', column: 'json', value: 'Содержит' },
      { variant: 4, operation: 'eq', column: 'json', value: 'Равно' },
      { variant: 5, operation: 'nsw', column: 'json', value: 'Не начинается с' },
      { variant: 6, operation: 'new', column: 'json', value: 'Не оканчивается на' },
      { variant: 7, operation: 'nct', column: 'json', value: 'Не содержит' },
      { variant: 8, operation: 'neq', column: 'json', value: 'Не равно' },
    ],
    date: [
      { variant: 1, operation: 'gt', column: 'dttm', value: 'После' },
      { variant: 2, operation: 'lt', column: 'dttm', value: 'До' },
    ],
    duration: [
      { variant: 1, operation: 'gt', column: 'duration_ms', value: 'Больше чем' },
      { variant: 2, operation: 'lt', column: 'duration_ms', value: 'Меньше чем' },
    ],
    link: [
      { variant: 1, operation: 'ct', column: 'referrer', value: 'Содержит' },
      { variant: 2, operation: 'nct', column: 'referrer', value: 'Не содержит' },
    ],
  };

  public filtersOptionsData: { [key: string]: { id: string; text: string }[] } = {
    user: [{ id: '-1', text: 'Все' }],
  };

  public checkboxesSelected: { [key: string]: boolean } = {};

  constructor(private store: Store<appState.State>, public dialog: MatDialog) {}

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.store.pipe(takeUntil(this._destroy$), select('router')).subscribe((router): void => {
      this.routerState = router;
    });

    this.store.pipe(takeUntil(this._destroy$), select('log')).subscribe((res: any): void => {
      if (res.data) {
        const logList = res.data.result.map(({ action, user, dttm, ...rest }): ILogData => {
          return {
            action,
            username: user?.username,
            timestamp: moment(moment.utc(dttm)).local().format('DD.MM.YYYY | HH:mm:ss'),
            rest,
          };
        });

        this.logList = new MatTableDataSource(logList);
        this.logList.sort = this.sort;
        this.logListData = logList;

        this.paginator.count = res.data.count;
        this.toggleAllCheckboxes({ checked: false });

        this.isLoading = false;
      }
    });

    this.store.pipe(takeUntil(this._destroy$), select('logUsers')).subscribe((res: any): void => {
      if (res.data) {
        this.filtersOptionsData.user = this.filtersOptionsData.user.concat(
          res.data.result.map((user) => ({
            ...user,
            id: String(user.id),
            idSelf: user.id,
          }))
        );
      }
    });

    this.getSortedLog();
    this.getLogUsers();
  }

  getSortedList(column: sortColumnType): void {
    if (column === this.sortColumn) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }

    this.getSortedLog();
  }

  getSortedLog(): void {
    this.checkboxesSelected = {};
    this.isLoading = true;

    this.store.dispatch(
      LogListGet({
        payload: {
          filters: this.getLogFilters(),
          order_column: this.sortColumn,
          order_direction: this.sortOrder,
          page: this.paginator.currentPage,
          page_size: this.paginator.pageSize,
        },
      })
    );
  }

  getLogUsers(): void {
    this.store.dispatch(LogUsersListGet({ payload: { page_size: -1 } }));
  }

  getLogFilters(): LogFilterType[] {
    const filtersModel = Object.values(this.filtersOptionsModel).filter(
      (filters) => filters.length > 0
    );

    const optionsModelFiltered = [];

    filtersModel.forEach((filters) =>
      filters.forEach((filter) => {
        if (
          filter.variant > -1 &&
          (filter.inputValue.length > 0 || Number(filter.inputValue) > -1)
        ) {
          optionsModelFiltered.push(filter);
        }
      })
    );

    const filters: LogFilterType[] = [];

    optionsModelFiltered.forEach(({ key, variant, inputValue }) => {
      if (this.filtersOptions[key] && variant > 0) {
        const { operation, column } = this.filtersOptions[key].find(
          (option) => option.variant === variant
        );

        filters.push({
          opr: operation,
          col: column,
          value: inputValue.trim(),
        });
      }
    });

    return filters;
  }

  onPageChange(e: any): void {
    this.isLoading = true;

    this.paginator.pageSize = e.pageSize;
    this.paginator.currentPage = e.pageIndex;
    this.paginator.skip = e.skip;

    this.getSortedLog();
  }

  openDialog(i: number): void {
    const log = this.logListData[i];

    this.dialog.open(LogDetailComponent, {
      data: { ...log, dialog: this.dialog },
    });
  }

  filtersOptionsChanged(key: string, index: number, variant: number): void {
    this.filtersOptionsModel[key][index].variant = variant;
  }

  filtersValueChanged(key: string, index: number, inputValue: string): void {
    if (inputValue === 'Все') {
      this.filtersOptionsModel[key][index].variant = -1;
      this.filtersOptionsModel[key][index].inputValue = '';

      this.getSortedLog();
    } else {
      this.filtersOptionsModel[key][index].inputValue = inputValue;
    }
  }

  dateChanged(dateSelected: any, index: number): void {
    const [day, month, year] = dateSelected.value.split('.');
    this.filtersValueChanged('date', index, [year, month, day].join('-'));
  }

  filtersOptionsShow(key: string): void {
    this.filtersOptionsModel[key].push({ key, inputValue: '', variant: 0 });
  }

  filtersOptionsHide(key: string, index: number): void {
    this.filtersOptionsModel[key].splice(index, 1);
    this.getSortedLog();
  }

  get isPossibleUpdateList(): boolean {
    return (
      Object.values(this.filtersOptionsModel)
        .filter((filters) => filters.length > 0)
        .filter((filters) =>
          filters.filter(({ variant, inputValue }) => variant > 0 && inputValue.length > 0)
        ).length > 0
    );
  }

  get allCheckboxesSelected(): number {
    return Object.values(this.checkboxesSelected).filter((checkbox) => checkbox).length;
  }

  get allCheckboxesSelectedWithText(): string {
    const str = this.getDeclensionForm(this.allCheckboxesSelected, [
      'действие',
      'действия',
      'действий',
    ]);
    return `${this.allCheckboxesSelected} ${str} выделено`;
  }

  getDeclensionForm(value: number, words: string[]): string {
    const val = Math.abs(value) % 100;
    const num = val % 10;

    if (val > 10 && val < 20) {
      return words[2];
    }

    if (num > 1 && num < 5) {
      return words[1];
    }

    if (num === 1) {
      return words[0];
    }

    return words[2];
  }

  toggleAllCheckboxes({ checked }: { checked: boolean }, isReset: boolean = false): void {
    for (let i = 0; i < this.paginator.pageSize; i += 1) {
      this.checkboxesSelected[i] = isReset ? false : checked;
    }
  }

  toggleCheckboxes({ checked }: { checked: boolean }, logIndex: number): void {
    this.checkboxesSelected[logIndex] = checked;
  }

  exportToCSV(): void {
    let csvData =
      'Пользователь,Действие,ID Аналитической панели,ID Виджета,JSON,Дата,Продолжительность,Ссылка\n';

    Object.keys(this.checkboxesSelected).forEach((index) => {
      if (this.checkboxesSelected[index]) {
        const log = this.logListData[index];

        csvData += `${log.username},`;
        csvData += `${log.action},`;
        csvData += `${log.rest.dashboard_id || '-'},`;
        csvData += `${log.rest.slice_id},`;
        csvData += `${log.rest.json.replace(/,/g, '͵')},`; // Замена на юникод запятую.
        csvData += `${log.timestamp},`;
        csvData += `${log.rest.duration_ms} м.сек,`;
        csvData += `${log.rest.referrer}\n`;
      }
    });

    const $link = document.createElement('a');
    const universalBOM = '\uFEFF';
    $link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(universalBOM + csvData);
    $link.target = '_blank';

    $link.download = 'logs.csv';
    $link.click();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
