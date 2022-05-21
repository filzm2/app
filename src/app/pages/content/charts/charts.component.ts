import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { select, Store } from '@ngrx/store';
import * as appState from '@store/reducers/index';
import { RouterStateUrl } from '@store/reducers/index';
import {
  ChartDelete,
  ChartGetPermissions,
  ChartListGet,
  ChartRelatedCreators,
  ChartRelatedDatasets,
  ChartRelatedOwners,
  ChartRelatedVizTypes,
  ChartSetFavoriteStatus,
} from '@store/actions/chart/chart.actions';
import { pairwise, startWith, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import * as rison from 'rison';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IDashboardDatasource, TViewMode } from '@page/content/dashboards/dashboards.interface';
import { ISelectItem } from '@store/reducers/dashboard/dashboard-related.reducer';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '@core/services/dialog.service';
import { State as chartState } from '@store/reducers/chart/chart.reducer';
import moment from 'moment';
import * as fromRouter from '@ngrx/router-store';
import { selectChartListState, selectRelatedDatasets } from '@store/selectors/chart/chart.selector';
import { IChartDatasource, TChartColumnName } from '@page/content/charts/chart.interface';
import { IChart } from '@models/chart/chart.model';
import { DashboardSetFavoriteStatus } from '@store/actions/dashboard/dashboard.actions';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChartsComponent implements OnInit {
  public chartList: IChartDatasource[];
  public paginator: any = {
    count: 0,
    pageSize: 25,
    currentPage: 0,
    skip: 0,
  };
  public permissions = {
    canRead: false,
    canWrite: false,
  };
  public isMobileFiltersShowed: boolean = false;
  public filterFormGroup: FormGroup;
  public searchFormControl: FormControl;
  public routerState: any;
  public displayedColumns: string[] = [
    'checkbox',
    'favorite',
    'chart',
    'viz_type',
    'dataset',
    'changed_by',
    'created_by',
    'actions',
  ];
  public viewMode: TViewMode = 'list';
  public owners: ISelectItem[] = [];
  public creators: ISelectItem[] = [];
  public vizTypes: string[] = [];
  public sortColumn: TChartColumnName = 'changed_on_delta_humanized';
  public currentSelect: number[] = [];
  public sortOrder: 'asc' | 'desc' = 'desc';
  public allFavorite = false;
  private _destroy$ = new Subject<null>();
  private filtersOptions: { [key: string]: { operation: string; column: string } } = {
    owners: { operation: 'rel_m_m', column: 'owners' },
    created_by: { operation: 'rel_o_m', column: 'created_by' },
    viz_type: { operation: 'eq', column: 'viz_type' },
    dataset: { operation: 'eq', column: 'datasource_id' },
    favorite: { operation: 'chart_is_favorite', column: 'id' },
    chart_title: { operation: 'chart_all_text', column: 'slice_name' },
  };
  private filterState = {
    owners: null,
    created_by: null,
    viz_type: null,
    dataset: null,
    favorite: null,
    chart_title: null,
  };

  public chartNameMap: { [key: string]: { name: string; icon: string } } = {
    pie: {
      name: 'Круговой',
      icon: 'chart_pie',
    },
    echarts_timeseries: {
      name: 'Гистограмма stacked',
      icon: 'chart_bar',
    },
    big_number: {
      name: 'Big number',
      icon: 'chart_line',
    },
    bar: {
      name: 'Гистограмма',
      icon: 'chart_bar',
    },
    histogram: {
      name: 'Гистограмма',
      icon: 'chart_bar',
    },
    sankey: {
      name: 'Санкей',
      icon: 'chart_sankey',
    },
    treemap: {
      name: 'Древокарта',
      icon: 'chart_treemap',
    },
    table: {
      name: 'Таблица',
      icon: 'chart_table',
    },
    dist_bar: {
      name: 'Гистограмма',
      icon: 'chart_bar',
    },
    area: {
      name: 'Таблица',
      icon: 'chart_table',
    },
    sunburst: {
      name: 'Радар',
      icon: 'chart_radar',
    },
    heatmap: {
      name: 'Таблица',
      icon: 'chart_table',
    },
    filter_box: {
      name: 'Таблица',
      icon: 'chart_table',
    },
    big_number_total: {
      name: 'Big_number',
      icon: 'chart_table',
    },
    world_map: {
      name: 'Таблица',
      icon: 'chart_table',
    },
    bubble: {
      name: 'Пузырьковый',
      icon: 'chart_bubble',
    },
    line: {
      name: 'Линейный',
      icon: 'chart_line',
    },
    dual_line: {
      name: 'Линейный',
      icon: 'chart_line',
    },
    line_multi: {
      name: 'Линейный',
      icon: 'chart_line',
    },
    pivot_table: {
      name: 'Таблица',
      icon: 'chart_table',
    },
    default: {
      name: '',
      icon: 'chart_line',
    },
  };
  public datasets: { label: string; value: any }[] = [{ label: 'Все', value: {} }];
  private currentPage = 0;
  private lockUpdateDatasets = false;
  private allDatasetsOnload: boolean = false;

  constructor(
    private store: Store<appState.State>,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService
  ) {
    this.filterFormGroup = this.fb.group({
      owners: null,
      created_by: null,
      favorite: null,
      viz_type: null,
      dataset: null,
    });
    this.searchFormControl = new FormControl('');
  }

  ngOnInit(): void {
    this.store.pipe(takeUntil(this._destroy$), select(selectChartListState)).subscribe((res) => {
      this.initChartList(res);
    });

    this.store
      .pipe(takeUntil(this._destroy$), select('router'), take(1))
      .subscribe((router) => this.initStateByUrl(router));

    this.store
      .pipe(takeUntil(this._destroy$), select('chartRelated'))
      .subscribe((data) => this.setRelatedData(data));

    this.store
      .pipe(takeUntil(this._destroy$), select('dashboardExport'))
      .subscribe((data) => this.exportDataSubscriber(data));

    this.store.pipe(takeUntil(this._destroy$), select(selectRelatedDatasets)).subscribe((res) => {
      if (Array.isArray(res) && res.length) {
        this.datasets = [...this.datasets, ...res];
        this.lockUpdateDatasets = false;
      }
      if (Array.isArray(res) && !res.length) {
        this.allDatasetsOnload = true;
      }
    });

    this.getChartList();

    this.store.dispatch(ChartRelatedDatasets({ payload: this.currentPage++ }));
    this.store.dispatch(ChartRelatedCreators());
    this.store.dispatch(ChartRelatedOwners());
    this.store.dispatch(ChartRelatedVizTypes());
    this.store.dispatch(ChartGetPermissions({ payload: { keys: ['permissions'] } }));

    this.filterFormGroup.valueChanges
      .pipe(takeUntil(this._destroy$), startWith(null), pairwise())
      .subscribe(([prev, current]) => {
        this.filterState = { ...this.filterState, ...current };
        this.filterState.dataset = this.filterState.dataset?.id ?? null;
        this.paginator.currentPage = 0;
        this.currentSelect = [];
        this.getChartList();
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public onPageChange(evt: any): void {
    this.paginator.pageSize = evt.pageSize;
    this.paginator.currentPage = evt.pageIndex;
    this.paginator.skip = evt.skip;
    this.getChartList();
  }

  public onSearch(search: HTMLInputElement): void {
    this.filterState.chart_title = search.value;
    this.paginator.currentPage = 0;
    this.currentSelect = [];
    this.getChartList();
  }

  public getSortList(column: TChartColumnName): void {
    if (column === this.sortColumn) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.currentSelect = [];
    this.getChartList();
  }

  public setAllCheckbox(checked: boolean, allPage: boolean = false): void {
    if (allPage) {
      this.currentSelect = [];
    }
    this.chartList.forEach((chart) => {
      chart.select = checked;
      this.changeSelect(checked, chart);
    });
  }

  public setFavoriteStatus(chart: IChartDatasource, all: boolean = false): void {
    if (all || !chart) {
      const arr = [];
      this.allFavorite = true;
      this.chartList.forEach((dashboard) => {
        arr.push(dashboard.id);
        if (!dashboard.favorite) {
          this.allFavorite = false;
        }
      });
      this.store.dispatch(
        ChartSetFavoriteStatus({
          payload: {
            data: arr,
            select: !this.allFavorite,
          },
        })
      );
      return;
    }

    this.store.dispatch(
      DashboardSetFavoriteStatus({
        payload: {
          data: [chart.id],
          select: !chart.favorite,
        },
      })
    );
  }

  public editChart(chart: IChartDatasource): void {
    this.router.navigate(['/main/charts/edit', chart.id]).then();
  }

  public redirectToChart(chart: IChartDatasource): void {
    if (this.permissions.canRead) {
      this.router.navigate(['/main/charts', chart.id]).then();
    }
  }

  public deleteChart(id: number): void {
    this.store.dispatch(ChartDelete({ payload: [id] }));
  }

  public deleteSelectedChart(): void {
    this.store.dispatch(ChartDelete({ payload: this.currentSelect }));
  }

  public getGroupDeleteButtonText(): string {
    const count = this.getSelectCount();
    const lastDigit = count % 10;
    let text = ' графика выделено';

    if ((count > 10 && count < 20) || lastDigit > 4 || lastDigit === 0) {
      text = ' графиков выделено';
    } else if (lastDigit === 1) {
      text = ' график выделен';
    }

    return count + text;
  }

  public isCheckedAll(): boolean {
    return this.chartList?.every((chart) => chart.select);
  }

  public someCheckedCurrentPage(): boolean {
    return this.chartList?.some((chart) => chart.select);
  }

  public someCheckedAllPage(): boolean {
    return !!this.currentSelect.length;
  }

  public someButNotAtAllChecked(): boolean {
    return this.someCheckedCurrentPage() && !this.isCheckedAll();
  }

  public exportChart(chart: IChartDatasource): void {
    // this.store.dispatch(DashboardExport({payload: [chart.id]}));
  }

  public changeViewMode(viewMode: TViewMode): void {
    this.paginator.pageSize = viewMode === 'tile' ? 9 : 10;
    this.viewMode = viewMode;
    this.getChartList();
  }

  private initChartList(res: chartState): void {
    if (res.needUpdate) {
      this.currentSelect = [];
      this.getChartList();
      return;
    }
    if (Array.isArray(res.info.permissions) && res.info.permissions.length) {
      const canRead = !!res.info.permissions.find((item) => item === 'can_read');
      const canWrite = !!res.info.permissions.find((item) => item === 'can_write');
      this.permissions = { canRead, canWrite };
    }
    const favoriteStatus = {};
    if (res.favoriteData && res.favoriteData.length) {
      res.favoriteData.forEach((item) => {
        favoriteStatus[item.id] = item.value;
      });
    }

    if (res.data) {
      const list: IChartDatasource[] = [];
      this.allFavorite = true;
      res.data.result.forEach((item) => {
        const favorite = !!favoriteStatus[item.id];
        if (!favorite) {
          this.allFavorite = false;
        }
        list.push({
          ...item,
          favorite: favorite,
          changed_on: moment(item.changed_on_utc).format('DD.MM.YY HH:mm'),
          last_saved_by_formatted: `${item.last_saved_by?.first_name ?? ''} ${
            item.last_saved_by?.last_name ?? ''
          }`,
          select: this.isSelectItem(item),
        });
      });
      this.chartList = list;
      this.paginator.count = res.data.count;
    }
    this.dialogService.errorHandler(res);
  }

  private initStateByUrl(router: fromRouter.RouterReducerState<RouterStateUrl>): void {
    const queryParams = router?.state?.queryParams;
    const queryParamsKeys = Object.keys(queryParams);
    if (queryParamsKeys.length) {
      queryParamsKeys.forEach((item) => {
        switch (item) {
          case 'viewMode':
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
              this.filterState = { ...this.filterState, ...filters };
              const pof = [];
              this.filterFormGroup.setValue(
                {
                  owners: filters.owners ?? null,
                  created_by: filters.created_by ?? null,
                  viz_type: filters.viz_type ?? null,
                  favorite: filters.favorite ?? null,
                  dataset: filters.dataset ?? null,
                },
                { emitEvent: false }
              );
              this.searchFormControl.setValue(filters.chart_title, { emitEvent: false });
            }
            break;
        }
      });
    }
    this.routerState = router;
  }

  private getSelectCount(): number {
    return this.currentSelect.length;
  }

  private setRelatedData(data): void {
    if (data.owners?.length) {
      this.owners = [...data.owners];
    }
    if (data.creators?.length) {
      this.creators = [...data.creators];
    }
    if (data.vizTypes?.length) {
      this.vizTypes = [...data.vizTypes];
    }
    this.dialogService.errorHandler(data);
  }

  private getChartList(): void {
    this.store.dispatch(
      ChartListGet({
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

  private exportDataSubscriber(data): void {
    // if (!data.data) {
    //   return;
    // }
    // const refElem = this.downloadRef.nativeElement;
    // const file = new Blob([JSON.stringify(data.data)], {type: 'text/plain'});
    // refElem.href = URL.createObjectURL(file);
    // refElem.download = `dashboard${data.data.id}.json`;
    // refElem.click();
    // this.dialogService.errorHandler(data);
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
      viewMode: this.viewMode,
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

  public changeSelect(checked: boolean, chart: IChartDatasource): void {
    if (checked) {
      this.currentSelect.push(+chart.id);
      return;
    }
    this.currentSelect = this.currentSelect.filter((id) => id !== +chart.id);
  }

  public updateDatasetList() {
    if (!this.lockUpdateDatasets && !this.allDatasetsOnload) {
      this.lockUpdateDatasets = true;
      this.store.dispatch(ChartRelatedDatasets({ payload: this.currentPage++ }));
    }
  }

  private isSelectItem(chart: IChart): boolean {
    return !!~this.currentSelect.indexOf(chart.id);
  }
}
