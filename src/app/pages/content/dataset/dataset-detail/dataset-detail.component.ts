import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { ReplaySubject, Subject } from 'rxjs';
import * as appState from '@store/reducers';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { DatasetGet } from '@store/actions/dataset/dataset.actions';
import { IDatasetSettings } from '@models/dataset/dataset-edit-settings.model';
import { ChartDetailDataPost } from '@store/actions/chart/chart.actions';
import { IColumn } from '@models/dataset/dataset-columns.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { toggleMenu } from '@page/content/dataset/components/dataset-aside-panel/dataset-aside-panel.animations';
import { DatasetService } from '@page/content/dataset/services/dataset.service';
import { DatasetListPopupComponent } from '@page/content/dataset/components/dataset-list-popup/dataset-list-popup.component';
import { DialogService } from '@core/services/dialog.service';
import { selectDatasetState } from '@store/selectors/dataset/dataset.selector';
import moment from 'moment';

@Component({
  selector: 'app-dataset-detail',
  templateUrl: './dataset-detail.component.html',
  styleUrls: ['./dataset-detail.component.scss'],
  animations: [toggleMenu],
  encapsulation: ViewEncapsulation.None,
})
export class DatasetDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  public datasetId: number;
  public datasetData: IDatasetSettings;
  public chartData: any;
  public searchFormControl: FormControl = new FormControl('');
  public dataSource: MatTableDataSource<any>;
  public asidePanelAnimationState$: ReplaySubject<'open' | 'close'>;
  public verboseNameMap = {};
  public permissions = {
    canRead: false,
    canWrite: false,
  };
  @ViewChild(MatSort) private sort: MatSort;
  @ViewChild(MatPaginator) private paginator: MatPaginator;
  private _destroy$ = new Subject<null>();

  constructor(
    private store: Store<appState.State>,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private datasetService: DatasetService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.asidePanelAnimationState$ = this.datasetService.getAsidePanelStateSubject();
    this.store
      .pipe(takeUntil(this._destroy$), select('router'), take(1))
      .subscribe((router) => this.initStateByUrl(router));

    this.store.pipe(takeUntil(this._destroy$), select(selectDatasetState)).subscribe((res) => {
      if (res.data) {
        this.datasetData = res.data.result;
        this.datasetData.columns?.forEach?.((col) => {
          this.verboseNameMap[col.column_name] = col.verbose_name;
        });
        this.getChartData();
      }
      this.dialogService.errorHandler(res);
    });
    this.store.pipe(takeUntil(this._destroy$), select('chartDetailData')).subscribe((res: any) => {
      if (Array.isArray(res?.data?.result) && res.data.result.length) {
        this.chartData = res.data.result[0];
        this.dataSource = new MatTableDataSource(this.chartData.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
      this.dialogService.errorHandler(res);
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private initStateByUrl(router): void {
    this.datasetId = router.state.params.id;
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

  ngAfterViewInit(): void {}

  private getChartData(): void {
    this.store.dispatch(
      ChartDetailDataPost({
        formData: {},
        body: {
          datasource: { id: this.datasetData.id, type: this.datasetData.datasource_type },
          force: false,
          result_format: 'json',
          result_type: 'samples',
          queries: [
            {
              extras: {
                time_grain_sqla: 'P1D',
                time_range_endpoints: ['inclusive', 'exclusive'],
              },
              granularity: null,
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

  public getCountRowLabel(): string {
    let rowCount = this.chartData?.rowcount || 0;
    if (rowCount < 1000) {
      return `Количество строк: ${rowCount}`;
    } else {
      rowCount = Math.round(rowCount / 1000);
      return `Количество строк: ${rowCount}K`;
    }
  }

  public onSearch(match: HTMLInputElement): void {
    const filterValue = match.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // todo
  public createChart(): void {}

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

  // todo
  public openSqlLab(): void {}

  getFormatDate(key: string, value: string) {
    const currentColumn = this.datasetData.columns.find((col) => col.column_name === key);
    const dateFormat = currentColumn?.python_date_format ?? 'DD.MM.YY HH:mm';
    return moment(value).local().format(dateFormat);
  }
}
