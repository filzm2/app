import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ChartClear, ChartCreate, ChartRelatedDatasets} from "@store/actions/chart/chart.actions";
import {select, Store} from "@ngrx/store";
import {takeUntil} from "rxjs/operators";
import {selectChartListState, selectRelatedDatasets} from "@store/selectors/chart/chart.selector";
import {Subject} from "rxjs";
import {TChartVizType} from "@page/content/charts/chart.interface";
import {DialogService} from "@core/services/dialog.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-chart-add',
  templateUrl: './chart-add.component.html',
  styleUrls: ['./chart-add.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChartAddComponent implements OnInit {
  public nameFormControl: FormControl = new FormControl();
  public datasetFormControl: FormControl = new FormControl();
  public datasets: {label: string, value: any}[] = [];
  public selectedVizType: string;
  public availableCharts: {
    name: string,
    key: TChartVizType,
    icon: string,
  }[] =
    [
    {
      name: 'Таблица',
      key: 'table',
      icon: 'big_table',
    },
    {
      name: 'Линейный',
      key: 'line',
      icon: 'big_line',
    },
    {
      name: 'Круговой',
      key: 'pie',
      icon: 'big_pie',
    },
    {
      name: 'Гистограмма',
      key: 'histogram',
      icon: 'big_bar',
    },
    {
      name: 'Пузырьковый',
      key: 'bubble',
      icon: 'big_bubble',
    },
    {
      name: 'Радар',
      key: 'radar',
      icon: 'big_radar',
    },
    {
      name: 'Древовидная карта',
      key: 'treemap',
      icon: 'big_treemap',
    },
    {
      name: 'Спидометр',
      key: 'gauge_chart',
      icon: 'big_gauge',
    },
    {
      name: 'Воронка',
      key: 'funnel',
      icon: 'big_funnel',
    },
    {
      name: 'Санкей',
      key: 'sankey',
      icon: 'big_sankey',
    },
  ];

  private _destroy$: Subject<any> = new Subject<null>();
  private currentDatasetPage: number = 0;
  private lockUpdateDatasets: boolean = false;
  private allDatasetsOnload: boolean = false;

  constructor(private store: Store,
              private dialog: DialogService,
              private router: Router) { }

  ngOnInit(): void {
    this.store.dispatch(ChartRelatedDatasets({payload: this.currentDatasetPage++}));

    this.store.pipe(takeUntil(this._destroy$), select(selectRelatedDatasets))
      .subscribe(res => {
        if (Array.isArray(res) && res.length) {
          this.datasets = [...this.datasets, ...res];
          this.lockUpdateDatasets = false;
        }
        if (Array.isArray(res) && !res.length) {
          this.allDatasetsOnload = true;
        }
      })

    this.store.pipe(takeUntil(this._destroy$), select(selectChartListState))
      .subscribe(res => {
        if (res.createdChart) {
          this.router.navigate([`main/charts/detail/`, res.createdChart.slice?.slice_id], {
            queryParams: {
              datasource: this.datasetFormControl.value.id,
              datasource_type: 'table',
              chart_type: this.selectedVizType,
            }
          }).then();
          this.store.pipe(takeUntil(this._destroy$), select(ChartClear));
        }
      })
  }

  public selectChart(chart: string): void {
    this.selectedVizType = chart;
  }

  public routeBack(): void {
    this.router.navigate(['/main/charts/']).then();
  }

  public updateDatasetList(): void {
    if (!this.lockUpdateDatasets && !this.allDatasetsOnload) {
      this.lockUpdateDatasets = true;
      this.store.dispatch(ChartRelatedDatasets({payload: this.currentDatasetPage++}));
    }
  }

  submit(): void {
    const formData = new FormData();
    const formDataBody = {
      viz_type: this.selectedVizType,
      datasource: this.datasetFormControl.value.id + '__table',
    }

    const queryContext = {
      datasource: {
        id: this.datasetFormControl.value.id,
        type: 'table',
      },
      queries: []
    }

    formData.append('form_data', JSON.stringify(formDataBody));
    formData.append('query_context', JSON.stringify(queryContext));
    this.store.dispatch(ChartCreate({
      payload: {
        data: formData,
        name: this.nameFormControl.value,
      }
    }))
  }
}
