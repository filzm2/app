import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as appState from '@store/reducers/index';
import { take, takeUntil } from 'rxjs/operators';
import {interval, Observable, ReplaySubject, Subject, Subscription} from 'rxjs';
import {
  ChartClear,
  ChartDetailDataGet,
  ChartDetailGet,
  ChartExploreJSONGet,
  ChartGetFavoriteStatus,
} from '@app/store/actions/chart/chart.actions';
import {
  selectChartCompleteDetailState,
  selectChartListState,
} from '@app/store/selectors/chart/chart.selector';
import { ChartOptionService } from '@app/core/services/chart-option.service';
import { EChartsOption } from 'echarts';
import { IDatasetSettings } from '@models/dataset/dataset-edit-settings.model';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatasetService } from '@page/content/dataset/services/dataset.service';
import { DialogService } from '@core/services/dialog.service';
import { selectDatasetState } from '@store/selectors/dataset/dataset.selector';
import { DatasetGet } from '@store/actions/dataset/dataset.actions';
import { IColumn } from '@models/dataset/dataset-columns.model';
import { DatasetListPopupComponent } from '@page/content/dataset/components/dataset-list-popup/dataset-list-popup.component';
import moment from 'moment';
import { toggleMenu } from '@page/content/dataset/components/dataset-aside-panel/dataset-aside-panel.animations';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'app-chart-detail',
  templateUrl: './chart-detail.component.html',
  styleUrls: ['./chart-detail.component.scss'],
  animations: [toggleMenu],
  encapsulation: ViewEncapsulation.None,
})
export class ChartDetailComponent implements OnInit {
  private _destroy$ = new Subject<null>();
  public routerState: any;
  public chartDetailComplete: any;
  public loading: boolean = true;
  public bigNumberData: any = {};
  public chartType: string = '';
  public favoriteStatus: boolean;
  public chartName: string;
  public searchFormControl: FormControl = new FormControl('');
  public viewMode: 'chart' | 'dataset' = 'chart';
  public datasetId: number;
  public datasetData: IDatasetSettings;
  public chartData: any;
  public dataSource: MatTableDataSource<any>;
  public asidePanelAnimationState$: ReplaySubject<'open' | 'close'>;
  public verboseNameMap = {};
  public startDate: any;
  public timeInterval: Observable<any>;
  public timeIntervalSub: Subscription;
  public lastTimerState: string = '00:00:00:00';
  public permissions = {
    canRead: false,
    canWrite: false,
  };
  @ViewChild(MatSort) private sort: MatSort;
  @ViewChild(MatPaginator) private paginator: MatPaginator;

  public chartTypeDict: any = {
    dist_bar: 'bar',
    bar: 'bar',
    bar_stacked: 'bar_stacked',
    treemap: 'treemap',
    pie: 'pie',
    sankey: 'sankey',
    line: 'line',
    big_number: 'big_number',
    big_number_total: 'big_number_total',
    bubble: 'bubble',
    echarts_timeseries: 'bar',
    sunburst: 'sunburst',
  };

  public chartOption: EChartsOption = {};
  public graph: any = {
    data: [
      {
        type: '',
      },
    ],
    layout: {
      width: 1000,
      height: 800,
    },
  };

  constructor(
    private store: Store<appState.State>,
    private chartOptionService: ChartOptionService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private datasetService: DatasetService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.datasetService.chartTimerSubject$.pipe(takeUntil(this._destroy$)).subscribe(bool => {
      if (bool) {
        this.startDate = new Date();
        this.timeInterval = interval(10);
        this.timeIntervalSub = this.timeInterval.pipe(takeUntil(this._destroy$)).subscribe(() => {
          if (!this.startDate) {
            this.timeIntervalSub.unsubscribe();
            return;
          }
          const now = new Date() as any;
          const margin = now - this.startDate;
          const seconds = (Math.floor(margin / 1000)).toString().padStart(2, '0');
          const milliseconds = (margin % 1000).toString().substr(0,2).padStart(2, '0');
          this.lastTimerState = `00:00:${seconds}:${milliseconds}`;
        });
        return;
      }
      this.timeIntervalSub.unsubscribe();
      this.startDate = null;
    });

    this.asidePanelAnimationState$ = this.datasetService.getAsidePanelStateSubject();
    this.datasetService.toggleAsideOpen();
    this.store
      .pipe(takeUntil(this._destroy$), select('router'), take(1))
      .subscribe((router) => {
        this.initStateByUrl(router);
        this.routerState = router;
      });

    this.store.pipe(takeUntil(this._destroy$), select(selectDatasetState)).subscribe((res) => {
      if (res.data) {
        this.datasetData = res.data.result;
        this.datasetData.columns?.forEach?.((col) => {
          this.verboseNameMap[col.column_name] = col.verbose_name;
        });
      }
      this.dialogService.errorHandler(res);
    });

    this.store.pipe(takeUntil(this._destroy$), select('chartExploreJSON')).subscribe((res) => {
      this.dialogService.errorHandler(res);
      if (res.error) {
        this.initForm(res.error);
        this.datasetService.chartTimerSubject$.next(false);
        this.dataSource = new MatTableDataSource([]);
      }
    });

    this.store
      .pipe(takeUntil(this._destroy$), select(selectChartCompleteDetailState))
      .subscribe((res) => {
        this.loading = res.loading;

        if (!res.data || !res.data.detail || !res.data.graphData) {
          return;
        }

        if (res.needUpdate) {
          this.playChart();
        }

        const isResolveChartData = Array.isArray(res?.data?.graphData?.result) && res.data.graphData.result.length;
        if (isResolveChartData) {
          this.chartData = res.data.graphData.result[0];
          if (!(Array.isArray(this.chartData?.data) || Array.isArray(this.chartData?.result)) ) {
            return;
          }
          this.dataSource = new MatTableDataSource(this.chartData?.data ?? this.chartData?.result);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          this.datasetService.chartTimerSubject$.next(false);
        }
        if (res.needUpdate) {
          return;
        }
        this.dialogService.errorLightHandler(res);
        this.chartDetailComplete = res.data;
        const params = res.useCache ? this.datasetService.cacheForm :  JSON.parse(res.data?.result?.params ?? null);
        const queryContext = JSON.parse(res.data?.result?.query_context ?? null);

        if (!this.chartType) {
          this.chartType = params?.stack
            ? 'bar_stacked_plan'
            : this.chartDetailComplete.result?.viz_type;
          this.chartName = this.chartDetailComplete.result?.slice_name;
        }

        if (res.data.graphData?.result?.[0]?.errors?.length) {
          this.chartOption = {};
          const errResponse = {...res.data.graphData?.result?.[0]};
          errResponse.error = errResponse.errors[0];
          this.dialogService.errorLightHandler(errResponse);

        } else {
          this.chartOption = this.chartOptionService.configChart({
            data: this.chartData,
            chartType: this.chartType,
            chartName: this.chartName,
          });
        }
        this.chartOption.parsedParams = res.data.graphData?.result?.[0]?.form_data ?? params;
        this.chartOption.queryContext = queryContext;

        if (!isResolveChartData) {
          this.chartData = this.chartOption;
        }

        if (res.error) {
          this.datasetService.chartTimerSubject$.next(false);

          this.dataSource = new MatTableDataSource([]);
        }

      });

    this.store.pipe(takeUntil(this._destroy$), select(selectChartListState)).subscribe((res) => {
      if (res.favoriteData && res.favoriteData.length) {
        this.favoriteStatus = res.favoriteData.find(
          (item) => item.id === +this.routerState.state.params.id
        )?.value;
      }
    });
  }

  public initForm(res: any): void {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private initStateByUrl(router): void {
    this.routerState = router;
    this.datasetId = router.state.queryParams.datasource;
    this.store.dispatch(ChartClear());
    // explore_json работает с line графиками, в отличие от Data Get

    if (
      router.state.queryParams.chart_type === 'line' ||
      router.state.queryParams.chart_type === 'histogram' ||
      router.state.queryParams.chart_type === 'dist_bar') {
      this.store.dispatch(ChartExploreJSONGet({ id: router.state.params.id }));
    } else {
      this.store.dispatch(ChartDetailDataGet({ id: router.state.params.id, q: {} }));
    }
    this.datasetService.chartTimerSubject$.next(true);
    this.store.dispatch(ChartDetailGet({ id: router.state.params.id, q: {} }));
    this.store.dispatch(ChartGetFavoriteStatus({ payload: { ids: [+router.state.params.id] } }));
    this.getDataset(this.datasetId);
    this.dialogService.errorHandler(router);
  }

  private getDataset(datasetId: number): void {
    this.store.dispatch(
      DatasetGet({
        payload: { datasetId },
      })
    );
  }

  public getCountRowLabel(): string {
    let rowCount = this.chartData?.rowcount || 0;
    if (rowCount < 1000) {
      return `Количество строк: ${rowCount}`;
    } else {
      rowCount = Math.round(rowCount / 1000);
      return `Количество строк: ${rowCount}K`;
    }
  }

  public saveChart(): void {
    this.datasetService.saveChartSubject$.next(true);
    this.datasetService.chartTimerSubject$.next(true);
    this.dataSource = null;
  }

  public playChart(): void {
    this.datasetService.saveChartSubject$.next(false);
    this.datasetService.chartTimerSubject$.next(true);
    this.dataSource = null;
  }

  public getColumnTypeIconName(column: IColumn): string {
    return this.datasetService.getColumnTypeIconName(column);
  }

  public isColumnIconByName(column: string): boolean {
    return this.getType(column) === 'date-type';
  }

  public getType(name): string {
    return this.datasetService.getTypeByColumnName(name);
  }

  public editDataset(): void {
    this.router
      .navigate(['/main/dataset/edit'], { queryParams: { id: this.datasetId, view: '1' } })
      .then();
  }

  public changeDataset(): void {
    const dialog = this.dialog.open(DatasetListPopupComponent, {});
    dialog
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe((res) => {
        if (res?.datasetId) {
          this.router.navigate(['/main/dataset/detail', res.datasetId]).then();
          this.getDataset(res.datasetId);
        }
      });
  }

  public getVerboseNameByColName(col: string) {
    return this.verboseNameMap[col] || col;
  }

  public openSqlLab(): void {}

  getFormatDate(key: string, value: string) {
    const currentColumn = this.datasetData.columns.find((col) => col.column_name === key);
    const dateFormat = currentColumn?.python_date_format ?? 'DD.MM.YY HH:mm';
    return moment(value).local().format(dateFormat);
  }

  public setFavoriteStatus() {}

  public isNegativeNumber(number: number) {
    return Math.sign(number);
  }

  public onSearch(match: HTMLInputElement): void {
    const filterValue = match.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  changeViewMode(event: MatButtonToggleChange): void {
    this.viewMode = event.value;
  }
}
