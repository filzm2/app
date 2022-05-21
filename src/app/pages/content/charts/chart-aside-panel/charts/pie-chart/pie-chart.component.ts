import {Component, Injector, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {
  turn180,
  verticalHide
} from "@page/content/dataset/components/dataset-aside-panel/dataset-aside-panel.animations";
import {AbstractChartSettingsComponent} from "@page/content/charts/chart-aside-panel/charts/abstract-chart-settings/abstract-chart-settings.component";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Observable, of} from "rxjs";
import {DropdownPopupMetricsComponent} from "@page/content/charts/chart-aside-panel/dropdown-popup-metrics/dropdown-popup-metrics.component";
import {DropdownPopupFiltersComponent} from "@page/content/charts/chart-aside-panel/dropdown-popup-filters/dropdown-popup-filters.component";
import {DropdownPopupComponent} from "@page/content/charts/chart-aside-panel/dropdown-popup/dropdown-popup.component";

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss', '../abstract-chart-settings/abstract-chart-settings.component.scss'],
  animations: [turn180, verticalHide],
})
export class PieChartComponent extends AbstractChartSettingsComponent implements OnInit, OnDestroy, OnChanges {

  public formGroup: FormGroup;
  public timeColumns$: Observable<any> = of([1, 2, 3]);
  public groupByOptions: any[] = [];
  public stateExpandedAnimation = {
    time: 'open',
    fetch: 'open',
    settings: 'open'
  }
  public multipleOptionsFieldsState = {
    time_range: [],
    metrics: [],
    percent_metrics: [],
    ordering: [],
    filters: [],
    custom_columns: [],

  };
  public rowLimits: number[] = [10, 50, 100, 250, 500, 1000, 5000, 10000, 50000];
  public timeStampFormats: [{value: 'mm/DD/yyyy', label: 'mm/DD/yyyy'}];

  public legendType: any[] = [{value: 'category', label: 'Имя категории'}, {value: 'value', label: 'Значение'},
    {value: 'percentage', label: 'Процент'}, {value: 'category_value', label: 'Категория и значение'},
    {value: 'category_percentage', label: 'Категория и процент'}, {value: 'category_value_percentage', label: 'Категория, значение и процент'}, ];
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

    if((changes.chartData?.currentValue || this.chartData) && (changes.datasetData?.currentValue || this.datasetData)) {
      const datasetData = this.datasetData;
      const chartData = this.chartData;
      this.formGroup = this.fb.group({
        time_column: '', // что это?
        time_range: [[chartData.parsedParams?.time_range] ?? ''],
        group_by: [chartData.parsedParams?.groupby ?? []],
        metrics: [chartData.parsedParams?.metrics ?? []],
        filters: [[]], // same
        row_limit: [chartData.parsedParams?.row_limit ?? []],
        sort_by_metric: [chartData.parsedParams?.sort_by_metric ?? []],

        color_scheme: '', // same
        percentage_threshold: '', // same
        show_legend: false, // same
        label_type: '', // same
        number_format: '', // same
        date_format: '', // same
        show_labels: false, // same
        put_labels_outside: false, // same
        label_line: false, // same
        outer_radius: 100, // same
        donut: false, // same
        inner_radius: 0, // same
      });
      this.multipleOptionsFieldsState.time_range = [chartData.parsedParams?.time_range]?.map?.(item => ({label: item, value: item})) ?? [];
      this.multipleOptionsFieldsState.metrics = chartData.parsedParams?.metrics?.map(item => ({label: item, value: item})) ?? [];
      this.multipleOptionsFieldsState.percent_metrics = chartData.parsedParams?.percent_metrics?.map(item => {

        const label = item.label ?? item;
        return ({
          label, value: item
        })
      }) ?? [];
      this.groupByOptions = chartData.parsedParams?.groupby ?? [];

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
    if (key === 'metrics' || key === 'percent_metrics' || key === 'ordering') {
      component = DropdownPopupMetricsComponent;
    } else if (key === 'filters') {
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
      let label = res.form.label ?? res.form.metric_name;
      if (key === 'filters') {
        const options = res.form.options.reduce((prev, current) => {
          if (!prev) {
            return current;
          }
          return prev + ', ' + current;
        }, '');
        label = `${res.label} ${res.form.opr} (${options})`
      }
      if (res.new) {
        this.multipleOptionsFieldsState[key].push({
          label, value: res.form
        });
        return;
      }

      this.multipleOptionsFieldsState[key].splice(index, 1, {
        label, value: res.form
      });

    });

  }
}
