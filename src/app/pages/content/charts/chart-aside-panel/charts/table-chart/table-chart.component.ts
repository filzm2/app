import {Component, Injector, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AbstractChartSettingsComponent} from "@page/content/charts/chart-aside-panel/charts/abstract-chart-settings/abstract-chart-settings.component";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {
  turn180,
  verticalHide
} from "@page/content/dataset/components/dataset-aside-panel/dataset-aside-panel.animations";
import {DropdownPopupComponent} from "@page/content/charts/chart-aside-panel/dropdown-popup/dropdown-popup.component";
import {DropdownPopupMetricsComponent} from "@page/content/charts/chart-aside-panel/dropdown-popup-metrics/dropdown-popup-metrics.component";
import {DropdownPopupFiltersComponent} from "@page/content/charts/chart-aside-panel/dropdown-popup-filters/dropdown-popup-filters.component";

@Component({
  selector: 'app-table-chart',
  templateUrl: './table-chart.component.html',
  styleUrls: ['./table-chart.component.scss', '../abstract-chart-settings/abstract-chart-settings.component.scss'],
  animations: [turn180, verticalHide],
})
export class TableChartComponent extends AbstractChartSettingsComponent implements OnInit, OnDestroy, OnChanges {

  public formGroup: FormGroup;
  public groupByOptions: any[] = [];
  public currentSubTab: 'aggregate' | 'raw' = 'aggregate';
  public stateExpandedAnimation = {
    time: 'open',
    fetch: 'open',
    settings: 'open'
  }
  public multipleOptionsFieldsState = {
    time_range: [],
    metrics: [],
    percent_metrics: [],
    timeseries_limit_metric: [],
    adhoc_filters: [],
    custom_columns: [],
  };
  public rowLimits: number[] = [10, 50, 100, 250, 500, 1000, 5000, 10000, 50000];
  public timeStampFormats: any[] = [{value: 'smart_date', label: 'Адаптивное форматирование'}, {value: '%d/%m/%Y', label: '%d/%m/%Y'},
    {value: '%m/%d/%Y', label: '%m/%d/%Y'}, {value: '%Y/%m/%d', label: '%Y/%m/%d'}, {value: '%d/%m/%Y %H/%M/%S', label: '%d/%m/%Y %H/%M/%S'},
    {value: '%Y/%m/%d %H/%M/%S', label: '%Y/%m/%d %H/%M/%S'}, {value: '%H/%M/%S', label: '%H/%M/%S'}, ];
  public pageLengths:
    [{value: 'All', label: 'Все'}, {value: '10', label: '10'}, {value: '20', label: '20'},
    {value: '50', label: '50'}, {value: '100', label: '100'}, {value: '200', label: '200'}];
  public dateColumns: any[] = [];
  public allColumns: any[] = [];
  public allSortType: any[] = [];
  public timeGrains: any[] = [
    { label: 'День', value: 'P1D' },
    { label: 'Неделя', value: 'P1W' },
    { label: 'Месяц', value: 'P1M' },
  ];
  constructor(injector: Injector, private fb: FormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.chartData);
    if (this.chartData && this.datasetData) {
      const datasetData = this.datasetData;
      const chartData = this.chartData;
      console.log(chartData, datasetData);
      const order_by_cols = this.chartData.parsedParams?.order_by_cols?.map?.(rawItem => {
        const item = JSON.parse(rawItem ?? null);
        const text = `${item[0]} (${item[1] ? 'asc' : 'desc'})`
        return ({
          value: rawItem,
          id: rawItem,
          text
        });
      });
      this.formGroup = this.fb.group({
        granularity_sqla: this.chartData.parsedParams?.granularity_sqla ?? null, // -=-
        time_grain_sqla: this.chartData.parsedParams?.time_grain_sqla ?? null, // -=-
        time_range: [[this.chartData.parsedParams?.time_range] ?? ''],
        groupby: [chartData.parsedParams?.groupby ?? []],
        metrics: [chartData.parsedParams?.metrics ?? []],
        percent_metrics: [chartData.parsedParams?.percent_metrics ?? []],
        timeseries_limit_metric: [chartData.parsedParams?.timeseries_limit_metric ?? []],
        row_limit: [chartData.parsedParams?.row_limit ?? 100],
        server_page_length: [chartData.parsedParams?.server_page_length ?? ''],
        server_pagination: [chartData.parsedParams?.server_pagination ?? false],
        show_totals: [chartData.parsedParams?.show_totals ?? false],
        include_time: [chartData.parsedParams?.include_time ?? false],
        order_desc: chartData.parsedParams?.order_desc ?? false,
        emit_filter: chartData.parsedParams?.emit_filter ?? false,
        adhoc_filters: [chartData.parsedParams?.adhoc_filters ?? []],
        all_columns: [chartData.parsedParams?.all_columns ?? []],
        order_by_cols: [order_by_cols ?? []],

        table_timestamp_format: [chartData.parsedParams?.table_timestamp_format ?? 'smart_date'],
        include_search: chartData.parsedParams?.include_search ?? false,
        cell_bars: chartData.parsedParams?.show_cell_bars ?? false,
        color_pn: chartData.parsedParams?.color_pn ?? false,
      });


      this.multipleOptionsFieldsState.time_range = [this.chartData.parsedParams?.time_range].map?.(item => {
        if (item === 'No filter') {
          return ({
            value: 'No filter',
            label: 'Без фильтра'
          });
        }
        return ({
          label: item?.split(' : ').map(i => new Date(i.trim()).toLocaleDateString())?.join(' : ') ?? '',
          value: item ?? ''
        })
      }) ?? [];

      this.multipleOptionsFieldsState.metrics = this.chartData.parsedParams?.metrics?.map?.(item => ({
        label: item?.label ?? item,
        value: item
      })) ?? [];

      this.multipleOptionsFieldsState.percent_metrics = this.chartData.parsedParams?.percent_metrics?.map?.(item => ({
        label: item?.label ?? item,
        value: item
      })) ?? [];

      this.multipleOptionsFieldsState.adhoc_filters = this.chartData.parsedParams?.adhoc_filters?.map?.(item => ({
        label: item?.operatorId,
        value: item
      })) ?? [];

      this.multipleOptionsFieldsState.timeseries_limit_metric = (this.chartData.parsedParams?.timeseries_limit_metric ?
        [this.chartData.parsedParams?.timeseries_limit_metric] : [])
        .map(item => ({value: item, label: item?.label ?? item}));

      this.groupByOptions = this.datasetData.columns.map?.(item => ({
        text: item.column_name,
        value: item.column_name,
      }));

      this.allColumns = datasetData.columns.map?.(item => item.column_name);
      this.dateColumns = this.datasetData.columns.filter(item => item.type_generic == 2);
      this.currentSubTab = this.chartData.parsedParams?.query_mode || 'aggregate';

      this.allSortType = datasetData.columns.map?.(item => {
        const value1 = JSON.stringify([item.column_name, true]).replace(',', ', ');
        const value2 = JSON.stringify([item.column_name, false]).replace(',', ', ');
        return [
          {
            text: `${item.column_name} (asc)`,
            value: value1,
            id: value1},
          {
            text: `${item.column_name} (desc)`,
            value: value2,
            id: value2}
        ];
      }).reduce((acc, current) => [...acc, ...current], []);
    }
  }

  public toggleExpandedState(type): void {
    this.stateExpandedAnimation[type] = this.stateExpandedAnimation[type] === 'open' ? 'close' : 'open';
  }

  public getFormControl(name: string): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  public changeTab(event: 'raw' | 'aggregate') {
    this.currentSubTab = event;
  }

  public itemClick(event: { event: PointerEvent, item: any, index: number }, key: string): void {
    const index = event.index;
    const bottom = document.documentElement.clientHeight - event.event.clientY;
    const isBottomPage = document.documentElement.clientHeight - event.event.clientY < 500;
    const position = isBottomPage ? {
      bottom: bottom + 'px',
      right: '455px',
    } : {
      top: event.event.clientY - 20 + 'px',
      right: '455px',
    };
    let component;
    if (key === 'metrics' || key === 'percent_metrics' || key === 'timeseries_limit_metric') {
      component = DropdownPopupMetricsComponent;
    } else if (key === 'adhoc_filters') {
      component = DropdownPopupFiltersComponent;
    } else {
      component = DropdownPopupComponent;
    }

    const dialogRef = this.dialog.open(component, {
      position,
      data: {
        key, event: event.item, dataset: this.datasetData, add: !event.item
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if (!res) {
        return;
      }
      let label = res.form?.label ?? res.form?.metric_name ?? res.form?.name;

      if (key === 'metrics' || key === 'percent_metrics' || key === 'timeseries_limit_metric') {

        if (res.form?.expressionType === 'SIMPLE') {
          label = `${res.form.aggregate} (${res.form.column.column_name})`;

        } else if (res.form?.expressionType === 'SQL') {
          label = res.form.sqlExpression;
        }

        if (res.form.metric) {
          label = res.form.metric;
          res.form = res.form.metric;
        }
        if (typeof res.form !== "string") {
          res.form = {...res.form};
          res.form.label = label;
        }
      }

      if (key === 'adhoc_filters' ) {
        const options = res.form.comparator.reduce((prev, current) => {
          if (!prev) {
            return current;
          }
          return prev + ', ' + current;
        }, '');
        label = `${res.label} ${res.form.subject} (${options})`;
      }

      const value = res.form?.value ?? res.form;

      if (res.new) {
        this.multipleOptionsFieldsState[key].push({ label, value });
        this.multipleOptionsFieldsState = {...this.multipleOptionsFieldsState};
        return;
      }

      this.multipleOptionsFieldsState[key].splice(index, 1, { label, value });
      this.multipleOptionsFieldsState = {...this.multipleOptionsFieldsState};
    });

  }

  public run(): void {
    const res = this.makeRequestBody();
    super.run(res);
  }

  public save(): void {
    const res = this.makeRequestBody();
    super.save(res);
  }

  private makeRequestBody(): any {
    const rawValue = this.formGroup.getRawValue();
    const requestBody = {
      ...this.chartData?.parsedParams,
      ...rawValue,
      ...this.multipleOptionsFieldsState,
      query_mode: this.currentSubTab
    }

    requestBody.time_range = requestBody.time_range[0].value;
    requestBody.metrics = requestBody.metrics.map(i => i.value);
    requestBody.percent_metrics = requestBody.percent_metrics.map(i => i.value);
    requestBody.adhoc_filters = requestBody.adhoc_filters.map(i => i.value);
    requestBody.timeseries_limit_metric = requestBody.timeseries_limit_metric.map(i => i.value)[0] ?? null;
    const { ...rest } = requestBody;
    return rest;
  }
}
