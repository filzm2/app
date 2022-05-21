import {Component, Injector, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {
  turn180,
  verticalHide600 as verticalHide
} from "@page/content/dataset/components/dataset-aside-panel/dataset-aside-panel.animations";
import {AbstractChartSettingsComponent} from "@page/content/charts/chart-aside-panel/charts/abstract-chart-settings/abstract-chart-settings.component";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {DropdownPopupMetricsComponent} from "@page/content/charts/chart-aside-panel/dropdown-popup-metrics/dropdown-popup-metrics.component";
import {DropdownPopupFiltersComponent} from "@page/content/charts/chart-aside-panel/dropdown-popup-filters/dropdown-popup-filters.component";
import {DropdownPopupComponent} from "@page/content/charts/chart-aside-panel/dropdown-popup/dropdown-popup.component";
import {DropdownAnnotationLayerComponent} from "@page/content/charts/chart-aside-panel/dropdown-annotation-layer/dropdown-annotation-layer.component";

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss', '../abstract-chart-settings/abstract-chart-settings.component.scss'],
  animations: [turn180, verticalHide],
})
export class BarChartComponent extends AbstractChartSettingsComponent implements OnInit, OnDestroy, OnChanges {

  public formGroup: FormGroup;
  public groupByOptions: any[] = [];
  public stateExpandedAnimation = {
    time: 'open',
    fetch: 'open',
    settings: 'open',
  }
  public multipleOptionsFieldsState = {
    time_range: [],
    metrics: [],
    adhoc_filters: [],
  };
  public rowLimits: number[] = [10, 50, 100, 250, 500, 1000, 5000, 10000, 50000];

  public dateColumns: any[] = [];

  public allColumns: any[] = [];

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
        time_range: [[this.chartData.parsedParams?.time_range] ?? ''],
        all_columns: [this.chartData.parsedParams?.all_columns ?? []],
        adhoc_filters: [this.chartData.parsedParams?.adhoc_filters ?? []],
        metrics: [this.chartData.parsedParams?.metrics ?? []],
        row_limit: [this.chartData.parsedParams?.row_limit ?? 10000],
        groupby: [this.chartData.parsedParams?.groupby ?? []],

        color_scheme: [this.chartData.parsedParams?.color_scheme ?? ''],
        show_legend: this.chartData.parsedParams?.show_legend ?? false,
        x_axis_label: this.chartData.parsedParams?.x_axis_label ?? '',

        y_axis_label: this.chartData.parsedParams?.y_axis_label ?? '',

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

      this.multipleOptionsFieldsState.adhoc_filters = this.chartData.parsedParams?.adhoc_filters?.map?.(item => ({
        label: item?.operatorId,
        value: item
      })) ?? [];
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
    };
    requestBody.time_range = requestBody.time_range[0].value;
    requestBody.metrics = requestBody.metrics.map(i => i.value);
    requestBody.adhoc_filters = requestBody.adhoc_filters.map(i => i.value);
    const { ...rest } = requestBody;
    return rest;
  }
}
