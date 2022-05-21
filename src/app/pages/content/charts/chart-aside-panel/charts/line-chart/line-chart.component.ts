import {Component, Injector, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {
  turn180,
  verticalHide600 as verticalHide
} from "@page/content/dataset/components/dataset-aside-panel/dataset-aside-panel.animations";
import {AbstractChartSettingsComponent} from "@page/content/charts/chart-aside-panel/charts/abstract-chart-settings/abstract-chart-settings.component";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Observable, of} from "rxjs";
import {DropdownPopupMetricsComponent} from "@page/content/charts/chart-aside-panel/dropdown-popup-metrics/dropdown-popup-metrics.component";
import {DropdownPopupFiltersComponent} from "@page/content/charts/chart-aside-panel/dropdown-popup-filters/dropdown-popup-filters.component";
import {DropdownPopupComponent} from "@page/content/charts/chart-aside-panel/dropdown-popup/dropdown-popup.component";
import {DropdownAnnotationLayerComponent} from "@page/content/charts/chart-aside-panel/dropdown-annotation-layer/dropdown-annotation-layer.component";

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss', '../abstract-chart-settings/abstract-chart-settings.component.scss'],
  animations: [turn180, verticalHide],
})
export class LineChartComponent extends AbstractChartSettingsComponent implements OnInit, OnDestroy, OnChanges {

  public formGroup: FormGroup;
  public groupByOptions: any[] = [];
  public stateExpandedAnimation = {
    time: 'open',
    fetch: 'open',
    settings: 'open',
    analytics: 'open',
    axisX: 'open',
    axisY: 'open',
    annotationLayer: 'open'
  }
  public multipleOptionsFieldsState = {
    time_range: [],
    metrics: [],
    timeseries_limit_metric: [],
    adhoc_filters: [],
    annotation_layers: [],
  };
  public timeGrains: any[] = [
    { label: 'День', value: 'P1D' },
    { label: 'Неделя', value: 'P1W' },
    { label: 'Месяц', value: 'P1M' },
  ];
  public seriesLimits: number[] = [0, 10, 50, 100, 250, 500];
  public rowLimits: number[] = [10, 50, 100, 250, 500, 1000, 5000, 10000, 50000];
  public timeStampFormats: [{ value: 'mm/DD/yyyy', label: 'mm/DD/yyyy' }];
  public rollingTypes = [{ value: null, label: 'None' }, { value: 'mean', label: 'mean' },
    { value: 'sum', label: 'sum' }, { value: 'std', label: 'std' }, { value: 'cumsum', label: 'cumsum' }];
  public timeCompares = [{ value: '1 day', text: '1 day' }, { value: '1 week', text: '1 week' },
    { value: '30 day', text: '30 day' }, { value: '1 year', text: '1 year' }, { value: '2 year', text: '2 year' }];
  public rules = ['1T', '1H', '1D', '7D', '1M', '1AS'];
  public methods = ['asfreq', 'bfill', 'ffill', 'median', 'mean', 'sum'];
  rangeFilters: any[] = [{value: 'auto', label: 'Авто'}, {value: 'yes', label: 'Да'}, {value: 'no', label: 'Нет'}];
  public layouts: any[] = [{value: 'auto', label: 'Авто'}, {value: 'flat', label: 'Плавающий'},
    {value: '45', label: '45'}, {value: 'staggered', label: 'Ступенчатый'}];
  public xAxisFormats: any[] = [{value: 'adaptive', label: 'Адаптивное форматирование'}, {value: '%d/%m/%Y', label: '%d/%m/%Y'},
    {value: '%m/%d/%Y', label: '%m/%d/%Y'}, {value: '%Y/%m/%d', label: '%Y/%m/%d'}, {value: '%d/%m/%Y %H/%M/%S', label: '%d/%m/%Y %H/%M/%S'},
    {value: '%Y/%m/%d %H/%M/%S', label: '%Y/%m/%d %H/%M/%S'}, {value: '%H/%M/%S', label: '%H/%M/%S'}, ];
  public yAxisFormats: any[] = [{value: 'adaptive', label: 'Адаптивное форматирование'}, {value: 'SMART_NUMBER', label: 'Оригинальное значение'} ];
  public dateColumns: any[] = [];
  public compareTypes: any[] = [{ value: 'value', label: 'Актуальное значение'}, { value: 'absolut', label: 'Абсолютная разница'},
    { value: 'percentage', label: 'Процентная разница'}, { value: 'value', label: 'Значение'}, { value: 'ratio', label: 'Соотношение'}, ];
  public lineStyles: any[] = [{ value: 'linear', label: 'Линейный'}, { value: 'basis', label: 'Базированный'},
    { value: 'cardinal', label: 'Кардинальный'}, { value: 'monotone', label: 'Монотонный'},
    { value: 'step-before', label: 'Предыдущий шаг'}, { value: 'step-after', label: 'следующий шаг'}];
  public margins: any[] = [{value: 'auto', label: 'Авто'}, {value: '50', label: '50'},
    {value: '75', label: '75'}, {value: '100', label: '100'}, {value: '125', label: '125'},
    {value: '150', label: '150'}, {value: '200', label: '200'}];

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
    if (this.chartData && this.datasetData) {
      console.log('finally chart', this.chartData, 'dataset', this.datasetData);
      this.formGroup = this.fb.group({
        granularity_sqla: this.chartData.parsedParams?.granularity_sqla ?? null, // -=-
        time_grain_sqla: this.chartData.parsedParams?.time_grain_sqla ?? null, // -=-
        time_range: [[this.chartData.parsedParams?.time_range] ?? ''],
        metrics: [this.chartData.parsedParams?.metrics ?? []],
        adhoc_filters: [this.chartData.parsedParams?.adhoc_filters ?? []],
        groupby: [this.chartData.parsedParams?.groupby ?? []],
        limit: [this.chartData.parsedParams?.limit ?? 100],
        order_desc: this.chartData.parsedParams?.order_desc ?? true,
        contribution: this.chartData.parsedParams?.contribution ?? false,
        row_limit: [this.chartData.parsedParams?.row_limit ?? 10000],

        rolling_type: this.chartData.parsedParams?.rolling_type ?? null,
        rolling_periods: this.chartData.parsedParams?.rolling_periods ?? '',
        min_periods: this.chartData.parsedParams?.min_periods ?? '',
        time_compare: [this.chartData.parsedParams?.time_compare ?? []],
        comparison_type: [this.chartData.parsedParams?.comparison_type ?? ''],
        resample_rule: [this.chartData.parsedParams?.resample_rule ?? ''],
        resample_method: [this.chartData.parsedParams?.resample_method ?? ''],

        annotation_layers: [this.chartData.parsedParams?.annotation_layers ?? []],

        color_scheme: [this.chartData.parsedParams?.color_scheme ?? ''],
        show_brush: [this.chartData.parsedParams?.show_brush ?? ''],
        show_legend: this.chartData.parsedParams?.show_legend ?? false,
        rich_tooltip: this.chartData.parsedParams?.rich_tooltip ?? false,
        show_markers: this.chartData.parsedParams?.show_markers ?? false,
        line_interpolation: this.chartData.parsedParams?.line_interpolation ?? 'linear',

        x_axis_label: this.chartData.parsedParams?.x_axis_label ?? '',
        bottom_margin: this.chartData.parsedParams?.bottom_margin ?? 'auto',
        x_ticks_layout: this.chartData.parsedParams?.x_ticks_layout ?? 'auto',
        x_axis_format: this.chartData.parsedParams?.x_axis_format ?? null,
        x_axis_showminmax: this.chartData.parsedParams?.x_axis_showminmax ?? false,

        y_axis_label: this.chartData.parsedParams?.y_axis_label ?? '',
        left_margin: this.chartData.parsedParams?.left_margin ?? 'auto',
        y_axis_showminmax: this.chartData.parsedParams?.y_axis_showminmax ?? false,
        y_log_scale: this.chartData.parsedParams?.y_log_scale ?? false,
        y_axis_format: this.chartData.parsedParams?.y_axis_format ?? 'auto',

        y_axis_bounds_min: this.chartData.parsedParams?.y_axis_bounds?.[0] ?? null,
        y_axis_bounds_max: this.chartData.parsedParams?.y_axis_bounds?.[1] ?? null,

      });

      this.multipleOptionsFieldsState.time_range = [this.chartData.parsedParams?.time_range].map?.(item => {
        if (item === 'No filter') {
          return ({
            value: 'No filter',
            label: 'Без фильтра'
          });
        }
        return ({
          label: item?.split(' : ').map(i => {
            const date = new Date(i.trim()).toLocaleDateString();
            return date === 'Invalid Date' ? i : date;
          })?.join(' : ') ?? '',
          value: item ?? ''
        })
      }) ?? [];

      this.multipleOptionsFieldsState.metrics = this.chartData.parsedParams?.metrics?.map?.(item => ({
        label: item?.label ?? item,
        value: item
      })) ?? [];

      this.multipleOptionsFieldsState.annotation_layers = this.chartData.parsedParams?.annotation_layers?.map?.(item => ({
        label: item?.name ?? item,
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
        value: item
      }));

      this.dateColumns = this.datasetData.columns.filter(item => item.type_generic == 2);
    }
  }

  public toggleExpandedState(type): void {
    this.stateExpandedAnimation[type] = this.stateExpandedAnimation[type] === 'open' ? 'close' : 'open';
  }

  public getFormControl(name: string): FormControl {
    return this.formGroup.get(name) as FormControl;
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
    } else if (key === 'annotation_layers') {
      component = DropdownAnnotationLayerComponent;
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
      if (!res) {
        return;
      }
      let label = res.form?.label ?? res.form?.metric_name ?? res.form?.name;

      if (key === 'metrics') {

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
        label = `${res.label} ${res.form.subject} (${options})`
      }

      const value = key === 'annotation_layers' ? res.form : (res.form?.value ?? res.form);

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
      ...this.multipleOptionsFieldsState
    }

    requestBody.y_axis_bounds = [requestBody.y_axis_bounds_min, requestBody.y_axis_bounds_max];
    requestBody.time_range = requestBody.time_range[0].value;
    requestBody.metrics = requestBody.metrics.map(i => i.value);
    requestBody.annotation_layers = requestBody.annotation_layers.map(i => i.value);
    requestBody.adhoc_filters = requestBody.adhoc_filters.map(i => i.value);
    requestBody.timeseries_limit_metric = requestBody.timeseries_limit_metric.map(i => i.value)[0] ?? null;
    const { y_axis_bounds_min, y_axis_bounds_max, ...rest } = requestBody;
    return rest;
  }
}
