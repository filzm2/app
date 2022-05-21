import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { TChartVizType } from "@page/content/charts/chart.interface";
import { MatTabChangeEvent } from "@angular/material/tabs";
import {
  turn180,
  verticalHide
} from "@page/content/dataset/components/dataset-aside-panel/dataset-aside-panel.animations";
import {select, Store} from "@ngrx/store";
import {ChartExploreJSONPost, ChartExplorePostSave, ChartGetFull} from "@store/actions/chart/chart.actions";
import {DatasetService} from "@page/content/dataset/services/dataset.service";
import {take, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-chart-aside-panel',
  templateUrl: './chart-aside-panel.component.html',
  styleUrls: ['./chart-aside-panel.component.scss'],
  animations: [turn180, verticalHide],
  encapsulation: ViewEncapsulation.None
})
export class ChartAsidePanelComponent implements OnInit, OnChanges {

  public availableCharts: TChartVizType[] = ['line', 'funnel', 'table', 'pie', 'radar', 'gauge_chart', 'histogram', 'bubble', 'treemap', 'sankey'];
  public currentChart: TChartVizType;
  public currentTab: 'data' | 'customize' = 'data';
  public stateExpandedAnimation: 'open' | 'close' = 'open';
  @Input() chartData: any;
  @Input() datasetData: any;
  @Input() name: string;
  @Input() sliceId: string;
  constructor(private store: Store, private datasetService: DatasetService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.chartData?.currentValue?.data?.chartType) {
      this.currentChart = changes.chartData.currentValue.data.chartType;
    }
    if (changes.chartData?.currentValue?.parsedParams?.viz_type) {
      this.currentChart = changes.chartData.currentValue.parsedParams.viz_type;
    }
  }

  public submit(event: any) {
    console.log('submit', event);
    const save = event.save;
    delete event.save;
    const jsonFormData = JSON.stringify(event);
    const formData = new FormData();
    this.datasetService.cacheForm = {...event};


    const columns = event.query_mode === 'raw' ? event.all_columns : event.groupby;
    const filters = event.adhoc_filters.map(item => ({
      col: item.subject,
      op: item.operator,
      val: item.comparator,
    }));
    const queryContext = {
      datasource: {id: this.datasetData.id, type: 'table'},
      force: false,
      queries: [{
        columns,
        annotation_layers: [],
        applied_time_extras: {},
        custom_form_data: {},
        custom_params: {},
        extras: {
          time_grain_sqla: event.time_grain_sqla,
          time_range_endpoints: event.time_range_endpoints,
          having: "",
          having_druid: [],
          where: "",
        },
        filters,
        granularity: event.granularity_sqla,
        order_desc: event.order_desc,
        orderby: event.order_by_cols?.map?.(item => {
          console.log(item);
          return JSON.parse(item.value)
        }),
        post_processing: [],
        row_limit: event.server_page_length,
        row_offset: 0,
        time_range: event.time_range,
        timeseries_limit: 0,
        url_params: {},
      }],
      result_format: 'json',
      result_type: 'full'
    }

    const jsonQueryContext = JSON.stringify(queryContext);

    switch (this.currentChart) {
      case 'dist_bar':
      case 'histogram':
      case 'line':
        formData.append('form_data', jsonFormData);
        if (save) {

          formData.append('query_context', jsonQueryContext)
          this.store.dispatch(ChartExplorePostSave({payload: {body: formData, id: this.sliceId, name: this.name}}));
          return;
        }
        this.store.dispatch(ChartExploreJSONPost({payload: {body: formData, id: this.sliceId}}));
        break;

      case 'table':

        if (save) {
          formData.append('form_data', jsonFormData);
          formData.append('query_context', jsonQueryContext)
          this.store.dispatch(ChartExplorePostSave({payload: {body: formData, id: this.sliceId, name: this.name}}));
          return;
        }

        this.store.dispatch(ChartGetFull({payload: {body: queryContext, id: this.sliceId}}));
        break;
    }
  }

  public changeTab(event: MatTabChangeEvent): void {
    this.currentTab = event.index ? 'customize' : 'data';
  }

  public selectChart(chart: TChartVizType): void {
    this.currentChart = chart;
  }

  public toggleExpandedState(): void {
    this.stateExpandedAnimation = this.stateExpandedAnimation === 'open' ? 'close' : 'open';
  }
}
