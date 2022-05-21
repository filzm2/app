import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import * as appState from '@store/reducers';
import {
  DatasetAllSchemaGet,
  DatasetClear,
  DatasetDatabasesGet,
  DatasetGetInfo,
  DatasetListGet,
  DatasetOwnersGet,
  DatasetSchemaGet,
  DatasetTypeGet,
} from '@store/actions/dataset/dataset.actions';
import { delay, take, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import moment from 'moment';
import { TColumnName } from '@page/content/dataset/dataset.interface';
import * as fromRouter from '@ngrx/router-store';
import { RouterStateUrl } from '@store/reducers';
import * as rison from 'rison';
import { AppHelpers } from '@core/helpers/app-helpers';
import { ChartDetailDataPost } from '@store/actions/chart/chart.actions';
import { MatDialog } from '@angular/material/dialog';
import { PopupWarningComponent } from '@shared/components/popups/popup-warning/popup-warning.component';

type DatasetFilterType = { col: string; opr: string; value: string | boolean };

export interface IDatasetData {
  id: number;
  name: string;
  source: string;
  schema: string;
  type: string;
  deltaTime: string;
  timestamp: string;
  modifiedName: string;
  ownersRaw: any;
  owners: string[];
  rest: { changed_by?: { first_name: string; username: string }; datasource_type?: any };
}

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss'],
})
export class DatasetComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<appState.State>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  private _destroy$ = new Subject<null>();
  private waitingDataForCSV: IDatasetData = null;

  public permissions = { canRead: false, canWrite: false };
  public isLoading = true;
  public sortColumn: TColumnName = 'changed_on_delta_humanized';
  public sortOrder: 'asc' | 'desc' = 'desc';
  public currentSelect: number[] = [];
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
  public search: string = '';
  public datasetList = new MatTableDataSource();
  public datasetListData: IDatasetData[];
  public displayedColumns: string[] = [
    'select',
    'name',
    'type',
    'source',
    'schema',
    'deltaTime',
    'modifiedName',
    'owners',
    'actions',
  ];

  public filtersOptionsModel: { [key: string]: { key: string; inputValue: string | boolean } } = {
    owners: { key: 'owners', inputValue: '-1' },
    source: { key: 'source', inputValue: '-1' },
    schema: { key: 'schema', inputValue: 'Все' },
    type: { key: 'type', inputValue: 'Все' },
    table_name: { key: 'table_name', inputValue: '' },
  };

  private filtersOptions: { [key: string]: { operation: string; column: string } } = {
    owners: { operation: 'rel_m_m', column: 'owners' },
    source: { operation: 'rel_o_m', column: 'database' },
    schema: { operation: 'eq', column: 'schema' },
    type: { operation: 'dataset_is_null_or_empty', column: 'sql' },
    table_name: { operation: 'ct', column: 'table_name' },
  };

  public filtersOptionsData: { [key: string]: { id: string; name: string; value?: any }[] } = {
    owners: [{ id: '-1', name: 'Все' }],
    source: [{ id: '-1', name: 'Все' }],
    schema: [{ id: '-1', name: 'Все' }],
    type: [
      { id: '-1', name: 'Все', value: 'Все' },
      { id: '1', name: 'Виртуальный', value: false },
      { id: '2', name: 'Физический', value: true },
    ],
  };

  public checkboxesSelected: { [key: string]: boolean } = {};

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.store
      .pipe(takeUntil(this._destroy$), select('router'), take(1))
      .subscribe((router) => this.initStateByUrl(router));

    this.store
      .pipe(takeUntil(this._destroy$), select('datasetList'))
      .subscribe((res: any) => this.datasetListSubscribe(res));

    this.store
      .pipe(takeUntil(this._destroy$), select('datasetOwners'))
      .subscribe((res: any) => this.dataSubscribe(res, 'owners'));

    this.store
      .pipe(takeUntil(this._destroy$), select('datasetDatabases'))
      .subscribe((res: any) => this.dataSubscribe(res, 'source'));

    this.store
      .pipe(takeUntil(this._destroy$), select('datasetAllSchema'))
      .subscribe((res: any) => this.dataSubscribe(res, 'schema'));

    this.store
      .pipe(takeUntil(this._destroy$), select('datasetSchema'))
      .subscribe((res: any) => this.schemaFormat(res));

    this.store
      .pipe(takeUntil(this._destroy$), select('datasetType'))
      .subscribe((res: any) => this.dataSubscribe(res, 'type'));

    this.store.pipe(takeUntil(this._destroy$), select('datasetClear')).subscribe((res: any) => {
      if (res.data) {
        this.getDatasetList();
      }
    });

    this.store.pipe(takeUntil(this._destroy$), select('chartDetailData')).subscribe((res: any) => {
      if (Array.isArray(res?.data?.result) && res.data.result.length && this.waitingDataForCSV) {
        this.exportToCSVSubscriber({
          filename: this.waitingDataForCSV.name ?? 'dataset',
          rows: res.data.result[0].data,
          headers: res.data.result[0].colnames,
          colTypes: res.data.result[0].coltypes,
        });
        this.waitingDataForCSV = null;
      }
    });

    this.store.dispatch(DatasetGetInfo({ payload: { keys: ['permissions'] } }));

    this.getDatasetList();
    this.getOwners();
    this.getDatabases();
    this.getSchema();
    this.getType();
  }

  datasetListSubscribe(res: any): void {
    if (Array.isArray(res.info.permissions) && res.info.permissions.length) {
      const canRead = !!res.info.permissions.find((item) => item === 'can_read');
      const canWrite = !!res.info.permissions.find((item) => item === 'can_write');
      this.permissions = { canRead, canWrite };
    }
    if (res.data) {
      const datasetList: IDatasetData[] = res.data.result.map(
        ({
          id,
          table_name: name,
          database: { database_name: source },
          kind: type,
          schema,
          changed_on_utc: deltaTime,
          changed_by_name: modifiedName,
          owners,
          ...rest
        }): IDatasetData => {
          return {
            id,
            name,
            source,
            type,
            schema,
            deltaTime: moment(deltaTime).format('DD.MM.YY HH:mm'),
            timestamp: moment(deltaTime).format('DD.MM.YYYY HH:mm:ss'),
            modifiedName,
            ownersRaw: owners,
            owners: owners.map((owner) => `${owner.first_name[0]}${owner.last_name[0]}`),
            rest,
          };
        }
      );
      this.datasetList = new MatTableDataSource(datasetList);
      this.datasetList.sort = this.sort;
      this.datasetListData = datasetList;
      this.paginator.count = res.data.count;
      this.isLoading = false;
    }
  }

  dataSubscribe(res: any, key: string): void {
    if (res.data) {
      this.filtersOptionsData[key] = [{ id: '-1', name: 'Все' }];

      res.data.result.forEach((elem: { value: number; text: string }) => {
        this.filtersOptionsData[key].push({
          id: String(elem.value),
          name: elem.text,
        });
      });
    }
  }

  getDatasetList(): void {
    this.isLoading = true;

    this.store.dispatch(
      DatasetListGet({
        payload: {
          order_column: this.sortColumn,
          order_direction: this.sortOrder,
          page: this.paginator.currentPage,
          page_size: this.paginator.pageSize,
          filters: this.getDatasetListFilters(),
        },
      })
    );
    this.setQueryParams();
  }

  public getSortList(column: TColumnName): void {
    this.checkboxesSelected = {};
    if (column === this.sortColumn) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'desc';
    }

    this.getDatasetList();
  }

  getOwners(): void {
    this.store.dispatch(DatasetOwnersGet({ payload: { page_size: -1 } }));
  }

  getDatabases(): void {
    this.store.dispatch(DatasetDatabasesGet({ payload: { page_size: -1 } }));
  }

  getSchema(databaseId: string = null): void {
    if (databaseId) {
      this.store.dispatch(
        DatasetSchemaGet({
          payload: {
            database: databaseId,
            page_size: -1,
          },
        })
      );
      return;
    }
    this.store.dispatch(DatasetAllSchemaGet());
  }

  getType(): void {
    this.store.dispatch(
      DatasetTypeGet({
        payload: {
          filters: [
            {
              opr: this.filtersOptions.type.operation,
              col: this.filtersOptions.type.column,
              value: this.filtersOptionsModel.type.inputValue,
            },
          ],
          order_direction: 'desc',
          page_size: -1,
        },
      })
    );
  }

  getDatasetListFilters(): DatasetFilterType[] {
    const optionsModelFiltered = Object.values(this.filtersOptionsModel).filter((option) => {
      return (
        (typeof option.inputValue === 'boolean' || option.inputValue.length > 0) &&
        option.inputValue !== '-1' &&
        option.inputValue !== 'Все'
      );
    });

    const filters: DatasetFilterType[] = [];

    optionsModelFiltered.forEach(({ key, inputValue }) => {
      const { operation, column } = this.filtersOptions[key];

      filters.push({
        opr: operation,
        col: column,
        value: inputValue,
      });
    });

    return filters;
  }

  onPageChange(e: any): void {
    this.isLoading = true;

    this.paginator.pageSize = e.pageSize;
    this.paginator.currentPage = e.pageIndex;
    this.paginator.skip = e.skip;

    this.getDatasetList();
  }

  async datasetOpen($event: Event, dataset: IDatasetData): Promise<void> {
    if (this.permissions.canRead) {
      $event.stopPropagation();
      await this.router.navigate(['/main/dataset/detail', dataset.id]);
    }
  }

  async datasetEdit($event: any, dataset: IDatasetData): Promise<void> {
    $event.stopPropagation();
    await this.router.navigate(['/main/dataset/edit'], { queryParams: { id: dataset.id } });
  }

  filtersValueChanged(key: string, inputValue: string): void {
    this.checkboxesSelected = {};
    this.filtersOptionsModel[key].inputValue = inputValue;
    if (key === 'source') {
      this.filtersOptionsModel.schema.inputValue = '-1';
      if (inputValue === '-1') {
        this.getSchema();
      } else {
        this.getSchema(inputValue);
      }
    }
    this.paginator.currentPage = 0;
    this.getDatasetList();
  }

  // todo какое имя поля для фильтра...
  dateChanged(dateSelected: any): void {
    this.filtersValueChanged('deltaTime', dateSelected.value);
  }

  get allCheckboxesSelected(): number {
    return Object.values(this.checkboxesSelected).filter((checkbox) => checkbox).length;
  }

  get allCheckboxesSelectedWithText(): string {
    const str = AppHelpers.getDeclensionForm(this.allCheckboxesSelected, [
      'набор',
      'набора',
      'наборов',
    ]);
    return `${this.allCheckboxesSelected} ${str}`;
  }

  toggleAllCheckboxes({ checked }: { checked: boolean }, allPage = false): void {
    if (allPage) {
      this.checkboxesSelected = {};
      return;
    }
    this.datasetListData.forEach((dataset) => {
      this.checkboxesSelected[dataset.id] = checked;
    });
  }

  toggleCheckboxes({ checked }: { checked: boolean }, datasetId: number): void {
    this.checkboxesSelected[datasetId] = checked;
  }

  exportToCSV($event: any, dataset: IDatasetData): void {
    this.waitingDataForCSV = dataset;
    this.store.dispatch(
      ChartDetailDataPost({
        formData: {},
        body: {
          datasource: { id: dataset.id, type: 'table' },
          force: false,
          result_format: 'json',
          result_type: 'samples',
          queries: [
            {
              extras: {
                time_grain_sqla: 'P1D',
                time_range_endpoints: ['inclusive', 'exclusive'],
              },
              granularity: 'Дата',
              metrics: ['count'],
              order_desc: true,
              orderby: [['count', false]],
              row_limit: 10000,
              time_range: 'No filter',
              timeseries_limit: 0,
            },
          ],
        },
      })
    );
  }

  public exportToCSVSubscriber({
    filename,
    rows,
    headers,
    colTypes,
  }: {
    filename: string;
    rows: object[];
    headers: string[];
    colTypes: number[];
  }): void {
    if (!rows || !rows.length) {
      return;
    }
    const separator: string = ';';
    const keys: string[] = Object.keys(rows[0]);
    const columnHearders: string[] = headers ? headers : keys;

    const csvContent =
      columnHearders.join(separator) +
      '\n' +
      rows
        .map((row) => {
          return keys
            .map((k, i) => {
              const type = colTypes[i];
              let cell = row[k] ?? '';

              cell =
                +type === 2
                  ? moment(cell).local(true).format('DD.MM.YY')
                  : cell.toString().replace(/"/g, '""');

              if (cell.search(/("|;|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
              return cell;
            })
            .join(separator);
        })
        .join('\n');

    const universalBOM = '\uFEFF';
    const blob = new Blob([universalBOM + csvContent], { type: 'text/csv;charset=utf-8' });

    /* @ts-ignore */
    if (navigator.msSaveBlob) {
      // In case of IE 10+
      /* @ts-ignore */
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  exportDatasetsToCSV(): void {
    this.getSelectedDataset((key: string): void => {
      this.exportToCSV(
        {
          stopPropagation() {},
        },
        this.datasetListData[key]
      );
    });
  }

  getSelectedDataset(callback: (key: string) => void): void {
    Object.keys(this.checkboxesSelected)
      .filter((key: string) => this.checkboxesSelected[key])
      .forEach(callback);
  }

  async removeDataset(dataset: IDatasetData): Promise<void> {
    this.store.dispatch(
      DatasetClear({
        payload: { datasetId: dataset.id },
      })
    );

    // Чтобы скрыть меню с действиями.
    document.getElementById('js-hidden-element-for-emit-click').click();
  }

  removeDatasets(): void {
    this.getSelectedDataset((key: string): void => {
      this.store.dispatch(
        DatasetClear({
          payload: { datasetId: key },
        })
      );
    });
    this.toggleAllCheckboxes({ checked: false }, true);
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
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
              Object.keys(filters).forEach((key) => {
                this.filtersOptionsModel[key].inputValue = filters[key];
              });
              if (filters.source && filters.source !== '-1') {
                of(null)
                  .pipe(delay(100))
                  .subscribe(() => this.getSchema(filters.source));
              }
            }
            break;
        }
      });
    }
  }

  private setQueryParams(): void {
    const filterState = {};
    Object.keys(this.filtersOptionsModel).forEach((key) => {
      filterState[key] = this.filtersOptionsModel[key].inputValue;
    });
    const queryParams: Params = {
      filters: rison.encode(filterState),
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

  public isCheckedAll(): boolean {
    return this.datasetListData?.every((dataset) => this.checkboxesSelected[dataset.id]);
  }

  public isSomeChecked(): boolean {
    return this.datasetListData?.some((dataset) => this.checkboxesSelected[dataset.id]);
  }

  public someButNotAtAllChecked(): boolean {
    return this.isSomeChecked() && !this.isCheckedAll();
  }

  private schemaFormat(res: any): void {
    if (Array.isArray(res.data?.result)) {
      const result = res.data.result.map((schema) => {
        return { text: schema, value: schema };
      });

      this.dataSubscribe({ data: { result } }, 'schema');
    }
    if (res.error) {
      this.dataSubscribe({ data: { result: [] } }, 'schema');
    }
  }

  public async confirmDeletion(
    $event,
    dataset: any[], // IDatasetData[] | number[] - зависит от operation.
    // Чтобы обойти случай, когда нет возможности определить имя датасета, когда выбран (чекбокс)
    // 1 элемент из списка - получаем список datasetIDs (если страницу переключить, то у нас
    // негде искать выбранные датасеты с предыдущей страницы).
    operation: 'one' | 'several'
  ): Promise<any> {
    $event.stopPropagation();

    if (dataset.length === 0) {
      dataset = Object.keys(this.checkboxesSelected);
    }

    let title = '';
    let text = '';

    if (operation === 'one') {
      title = 'Удаление датасета';
      text = `Точно ли Вы хотите удалить датасет "${dataset[0].name}"?`;
    } else if (operation === 'several') {
      title = 'Удаление нескольких датасетов';
      const message = this.declOfNum(dataset.length, [
        'выбранный датасет',
        'выбранных датасета',
        'выбранных датасетов',
      ]);

      text = `Точно ли Вы хотите удалить ${dataset.length} ${message}?`;
    } else {
      console.log('confirmDeletion / Необработанный сценарий #1');
    }

    this.dialog
      .open(PopupWarningComponent, {
        data: {
          title,
          text,
          btnSuccessTitle: 'Удалить',
          btnCancelTitle: 'Отмена',
        },
      })
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe((isConfirm: boolean) => {
        if (isConfirm) {
          if (operation === 'one') {
            this.removeDataset(dataset[0]);
          } else if (operation === 'several') {
            this.removeDatasets();
          } else {
            console.log('confirmDeletion / Необработанный сценарий #2');
          }
        }
      });
  }

  private declOfNum(number: number, titles: string[]): string {
    const cases = [2, 0, 1, 1, 1, 2];

    return titles[
      number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]
    ];
  }
}
