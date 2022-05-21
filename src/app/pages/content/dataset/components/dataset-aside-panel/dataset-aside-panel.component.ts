import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IColumn } from '@models/dataset/dataset-columns.model';
import { IMetric } from '@models/dataset/dataset-metrics.model';
import { takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { selectDatasetPermissionsState } from '@store/selectors/dataset/dataset.selector';
import { ReplaySubject, Subject } from 'rxjs';
import * as appState from '@store/reducers';
import { DatasetService } from '@page/content/dataset/services/dataset.service';
import { DatasetGetInfo } from '@store/actions/dataset/dataset.actions';
import {
  horizontalHide,
  toggleMenu,
  turn180,
  verticalHide,
  verticalHideDescription
} from '@page/content/dataset/components/dataset-aside-panel/dataset-aside-panel.animations';

@Component({
  selector: 'app-dataset-aside-panel',
  templateUrl: './dataset-aside-panel.component.html',
  styleUrls: ['./dataset-aside-panel.component.scss'],
  animations: [toggleMenu, horizontalHide, verticalHide, turn180, verticalHideDescription],
  encapsulation: ViewEncapsulation.None,
})
export class DatasetAsidePanelComponent implements OnInit, OnChanges {
  @Input() public datasetData: any;
  @Output() public edit: EventEmitter<any> = new EventEmitter<any>();
  @Output() public changeDataset: EventEmitter<any> = new EventEmitter<any>();
  @Output() public openSql: EventEmitter<any> = new EventEmitter<any>();

  public permissions: { canRead: boolean, canWrite: boolean };
  public asideSearchFormControl: FormControl = new FormControl('');
  public stateDropdownAnimation: { metrics: 'open' | 'close', columns: 'open' | 'close', description: 'open' | 'close', } = {
    metrics: 'open',
    columns: 'open',
    description: 'close'
  };
  public displayColumns: IColumn[] = [];
  public displayMetrics: IMetric[] = [];
  public asidePanelAnimationState$: ReplaySubject<'open' | 'close'>;
  public cutDescription: string;
  public needCutDescription: boolean;
  private _destroy$ = new Subject<null>();

  constructor(
    private store: Store<appState.State>,
    private datasetService: DatasetService,
  ) { }

  ngOnInit(): void {
    this.asidePanelAnimationState$ = this.datasetService.getAsidePanelStateSubject();
    this.store.pipe(takeUntil(this._destroy$), select(selectDatasetPermissionsState))
      .subscribe((res: any) => this.datasetPermissionsSubscribe(res));

    this.store.dispatch(DatasetGetInfo({payload: {keys: ['permissions']}}));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.datasetData?.currentValue) {
      this.showLess('metrics');
      this.showLess('columns');
      this.setCutDescription();
    }
  }

  public editDataset(): void {
    this.edit.emit(true);
  }

  public onChangeDataset(): void {
    this.changeDataset.emit(true);
  }

  public openSqlLab(): void {
    this.openSql.emit(true);
  }

  public onSearchMetricsAndColumn(input: HTMLInputElement): void {
    const match = input.value.toLowerCase();
    this.displayColumns = this.datasetData.columns.filter(column =>
      this.getColumnLabel(column).toLowerCase().indexOf(match) !== -1);
    this.displayMetrics = this.datasetData.metrics.filter(metric =>
      this.getMetricLabel(metric).toLowerCase().indexOf(match) !== -1);
  }

  public setDropdownState(key: 'metrics' | 'columns' | 'description'): void {
    this.stateDropdownAnimation[key] = this.stateDropdownAnimation[key] === 'open' ? 'close' : 'open';
  }

  public toggleAsideOpen(): void {
    this.datasetService.toggleAsideOpen();
    if (this.datasetService.stateMenuAnimation === 'close') {
      this.stateDropdownAnimation.description = 'close';
    }
  }

  public isAllShowed(name: 'metrics' | 'columns'): boolean {
    const count = this.datasetData?.[name]?.length;
    const displayCount = name === 'columns' ? this.displayColumns.length : this.displayMetrics.length;
    return !!(count - displayCount);
  }

  public showAll(name: 'metrics' | 'columns'): void {
    if (name === 'columns') {
      this.displayColumns = this.datasetData.columns;
      return;
    }
    this.displayMetrics = this.datasetData.metrics;
  }

  public showLess(name: 'metrics' | 'columns'): void {
    if (name === 'columns') {
      this.displayColumns = this.datasetData.columns.slice(0, 50);
      return;
    }
    this.displayMetrics = this.datasetData.metrics.slice(0, 50);
  }

  public getGroupCountLabel(name: 'metrics' | 'columns'): string {
    const count = this.datasetData?.[name]?.length;
    const displayCount = name === 'columns' ? this.displayColumns.length : this.displayMetrics.length;
    return `Показано ${displayCount} из ${count}`;
  }

  public getMetricTypeIconName(metric: IMetric): string {
    return (metric.expression && metric.expression !== metric.metric_name) ? 'ƒ' : '?';
  }

  public getMetricLabel(metric: IMetric): string {
    return metric.verbose_name || metric.metric_name;
  }

  public getColumnTypeIconName(column: IColumn): string {
    return this.datasetService.getColumnTypeIconName(column);
  }

  public isColumnIcon(column: IColumn): boolean {
    return column.type_generic === 2;
  }

  public getColumnLabel(column: any): string {
    return this.datasetService.getColumnLabel(column, true);
  }

  private datasetPermissionsSubscribe(res: any): void {
    this.permissions = res.data;
  }

  private setCutDescription() {
    const size = 90;
    const description = this.datasetData.description;
    if (description && description.length > size) {
      this.cutDescription = description.substr(0, size) + '...';
      this.needCutDescription = true;
      return
    }

    this.cutDescription = description;
    this.needCutDescription = false;
  }
}
