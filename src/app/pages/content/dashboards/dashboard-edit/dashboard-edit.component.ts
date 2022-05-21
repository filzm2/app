import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as appState from '@store/reducers/index';
import {
  ChartClear,
  ChartDetailDataPost,
  ChartDetailGet,
  ChartAddDashboard,
  ChartDeleteDashboard,
  ChartListMSGet,
} from '@store/actions/chart/chart.actions';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import clonedeep from 'lodash.clonedeep';
import { nanoid } from 'nanoid';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardDetailDialogComponent } from '../dashboard-detail/dashboard-detail-dialog';
import { environment } from '@app/../environments/environment';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FormControl, FormGroup } from '@angular/forms';
import { ChartOptionService } from '@app/core/services/chart-option.service';

import {
  CompactType,
  DisplayGrid,
  Draggable,
  GridsterComponentInterface,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface,
  GridType,
  PushDirections,
  Resizable,
} from 'angular-gridster2';
import {
  DashboardClear,
  DashboardDetailChartGet,
  DashboardDetailFavoriteStatusListGet,
  DashboardDetailGet,
  DashboardDetailUpdate,
  DashboardSetFavoriteStatus,
  DashboardUpdatedClear,
} from '@app/store/actions/dashboard/dashboard.actions';
import { Router } from '@angular/router';
import { selectDashboardCompleteDetailState } from '@app/store/selectors/dashboard/dashboard.selector';
import { MatDialog } from '@angular/material/dialog';
import { PopupDashboardOwnersComponent } from '@shared/components/popups/popup-dashboard-owners/popup-dashboard-owners.component';
import { DashboardAutorefreshDialogComponent } from '../dashboard-detail/components/dashboard-autorefresh-dialog/dashboard-autorefresh-dialog.component';
import { IDashboardIntervalType } from '@app/models/dashboard/dashboard.model';

interface Safe extends GridsterConfig {
  draggable: Draggable;
  resizable: Resizable;
  pushDirections: PushDirections;
}

interface IDashboardHistory {
  type: number;
  item: GridsterItem;
}

enum DashboardActions {
  added,
  modified,
  deleted,
}

@Component({ template: '<span style="color: white;">Ссылка скопирована в буфер обмена</span>' })
export class CopyLinkDashboardComponent {}

@Component({ template: '<span style="color: white;">Ссылка на график отправлена</span>' })
export class EmailSendedComponent {}

@Component({ template: '<span style="color: #EF8983;">Ссылка на график не отправлена</span>' })
export class EmailSendedErrorComponent {}

@Component({
  selector: 'app-dashboard-edit',
  templateUrl: './dashboard-edit.component.html',
  styleUrls: ['./dashboard-edit.component.scss'],
})
export class DashboardEditComponent implements OnInit {
  @Output() cancelEdit = new EventEmitter<any>();

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    if (event.target.tagName.toUpperCase() !== 'INPUT') {
      this.editTabTitle = [-1, -1];
    }
  }

  public userId: string = '';

  public name = new FormControl('');

  public chartTypeDict: any = {
    dist_bar: 'bar',
    bar: 'bar',
    bar_stacked: 'bar_stacked',
    bar_stacked_plan: 'bar_stacked_plan',
    echarts_timeseries: 'bar',
    treemap: 'treemap',
    pie: 'pie',
    sankey: 'sankey',
    line: 'line',
    big_number: 'big_number',
    big_number_total: 'big_number_total',
    bubble: 'bubble',
    sunburst: 'sunburst', // временное название, нужен был любой
    // график-заглушка для хранения цифр плана/факта
  };

  public paginator: any = {
    count: 0,
    pageSize: 50,
    currentPage: 0,
    skip: 0,
  };

  private _destroy$ = new Subject<null>();
  public loading = true;
  public dashboardId = '';
  public routerState: any;
  public chartList: any;
  public chartListFiltered: any;
  public dashboardDataList: any = [];
  public showGrid = true;
  public chartsDom = {};
  public dashboardPosition: any;
  public editChartTitleId = 0;
  public editMarkdown = -1;
  public editTabTitle = [-1, -1];
  public editHeader = -1;
  public editHaderSize = 14;
  public editHeaderBackground = 'white';
  public deletedCharts: Set<string> = new Set();

  public tabs = ['First', 'Second', 'Third'];
  public selected = new FormControl(0);

  public options: Safe;
  public optionsForTabs: Safe;
  public dashboard: Array<GridsterItem>;
  public dashboardHistoryLeft: IDashboardHistory[] = [];
  public dashboardHistoryRight: IDashboardHistory[] = [];
  private dashboardChange = { x: -1, y: -1, cols: -1, rows: -1, title: '' };
  private initChartCount: number;
  private editAfterSave = false;

  public dashboardChartsEdit: any = {};
  public dashboardInfo: any = {};

  public isPublished = false;

  public chartsFilterValue = '';
  public chartsSort = {
    col: 'changed_on_delta_humanized',
    direction: 'desc',
  };

  public headerSizes: any = {
    large: 20,
    medium: 16,
    small: 14,
    extrasmall: 12,
  };

  public dashComponentsList: any = [
    {
      component: true,
      title: 'Вкладки',
      type: 'tabs',
      selected: 0,
      tabs: [
        {
          title: 'Вкладка 1',
          items: [],
        },
      ],
    },
    {
      component: true,
      title: 'Заголовок',
      type: 'header',
      header: 'Заголовок',
      size: this.headerSizes.small,
      background: 'white',
    },
    {
      component: true,
      title: 'Markdown',
      type: 'markdown',
      text: '# Markdown \n ## Markdown \n Нажмите, чтобы редактировать',
    },
    {
      component: true,
      title: 'Разделитель',
      type: 'delimeter',
    },
  ];

  public sortOptions: any = [
    {
      value: 'slice_name',
      viewValue: 'Название',
    },
    {
      value: 'viz_type',
      viewValue: 'Тип',
    },
    {
      value: 'datasource_name',
      viewValue: 'Датасет',
    },
    {
      value: 'changed_on_delta_humanized',
      viewValue: 'Дата',
    },
  ];

  public chartsFilter = new FormGroup({
    quicksearch: new FormControl(),
    sortType: new FormControl(),
  });

  public favoriteStatus: any;
  public tabHeightSettings: { [key: string]: string } = {};

  // Объект с данными о графиках, которые получаем с помощью /chart/data
  public chartsFromDashboardData: any = {};
  private notifyDurationInSeconds = 3;

  public autoRefreshTimer: number;
  private autoRefreshValue: IDashboardIntervalType = {
    value: 0,
    name: 'Не обновлять',
  };

  constructor(
    private store: Store<appState.State>,
    private chartOptionService: ChartOptionService,
    private router: Router,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // this.store.dispatch(ChartClear());
    // this.store.dispatch(DashboardClear());
    this.userId = localStorage.getItem('userId');
    this.store.pipe(takeUntil(this._destroy$), select('router')).subscribe((router) => {
      this.routerState = router;

      if (router.state.params.editId) {
        this.dashboardId = router.state.params.editId.toString();
        // this.store.dispatch(DashboardClear());
        // this.store.dispatch(ChartClear());
        this.store.dispatch(
          DashboardDetailGet({
            id: router.state.params.editId,
            q: {},
          })
        );
        this.store.dispatch(DashboardDetailChartGet({ id: router.state.params.editId }));
        this.store.dispatch(
          DashboardDetailFavoriteStatusListGet({
            payload: {
              ids: [parseInt(router.state.params.editId, 10)],
            },
          })
        );
      }
    });

    this.store.pipe(takeUntil(this._destroy$), select('dashboardUpdate')).subscribe((res) => {
      if (res.updated && res.data.result.dashboard_title) {
        this.store.dispatch(DashboardUpdatedClear());
        this.router.navigate([`/main/dashboard/${this.dashboardId}/`]).then(() => {
          if (this.editAfterSave) {
            this.editAfterSave = false;
            // костыль, не нашёл способа заново запросить данные без поломки дашборда
            this.router.navigate([`/main/dashboard/edit/${this.dashboardId}/`]).then();
          }
        });
      }
    });
    this.store.pipe(takeUntil(this._destroy$), select('dashboardFavorite')).subscribe((res) => {
      if (res.data) {
        this.favoriteStatus = res.data[0].value;
      }
    });
    this.store
      .pipe(takeUntil(this._destroy$), select(selectDashboardCompleteDetailState))
      .subscribe((res) => {
        if (res.data && !res.loading) {
          // this.favoriteStatus = res.data.favorite[0].value;
          this.dashboardInfo = res.data;
          this.isPublished = this.dashboardInfo?.result.published;
          this.name.setValue(this.dashboardInfo.result.dashboard_title);
          this.dashboardPosition = JSON.parse(res.data.result?.position_json);
          res.data.chartsData.result.forEach((element: any) => {
            const newElement = clonedeep(element.form_data);

            if (newElement.metric) {
              newElement.metrics = [newElement.metric];
              // delete newElement.metric;
            }

            if (newElement.secondary_metric) {
              newElement.metrics.push(clonedeep(newElement.secondary_metric));
            }
            if (newElement.datasource) {
              delete newElement.datasource;
            }
            if (
              newElement.granularity_sqla &&
              element.form_data.viz_type !== 'big_number_total' &&
              element.form_data.viz_type !== 'sunburst' &&
              element.form_data.viz_type !== 'pie'
            ) {
              newElement.granularity = newElement.granularity_sqla;
              // if (newElement.bar_stacked || newElement.stack) {
              newElement.columns = [newElement.granularity, '__timestamp'];
              // } else {
              // newElement.columns = [newElement.granularity];
              // }

              delete newElement.granularity_sqla;
            }
            if (element.form_data.viz_type === 'bubble') {
              newElement.columns = [
                newElement.entity,
                newElement.size.column.column_name,
                newElement.x.column.column_name,
                newElement.y.column.column_name,
              ];
              newElement.groupby = [newElement.entity];
              newElement.metrics = [newElement.size, newElement.x, newElement.y];
            }
            const datasource = element.form_data.datasource.split('__');
            const body = {
              datasource: {
                id: datasource[0],
                type: datasource[1],
              },
              queries: [newElement],
              result_format: 'json',
              result_type: 'full',
            };
            this.addChartInfo(element, body);
          });
          this.initChartCount = res.data.chartsData.result.length;
          if (this.initChartCount === 0) {
            this.loading = false;
            this.loadGridItems();
          }
        }
      });
    // if (this.dashboardCharts) {
    //   Object.assign(this.dashboardChartsEdit, this.dashboardCharts);
    //   // this.loadGridItems();
    // }

    // if (this.dashboardInfo?.result) {
    //   this.name.setValue(this.dashboardInfo.result.dashboard_title);
    // }

    // if (this.dashboardInfo?.result.position_json) {
    //   this.dashboardPosition =
    // JSON.parse(this.dashboardInfo.result.position_json); }

    this.loadCharts();
    this.store.pipe(takeUntil(this._destroy$), select('chart')).subscribe((res) => {
      if (res.data) {
        this.chartList = res.data.result;
        this.chartListFiltered = res.data.result;
        this.paginator.count = res.data.count;
      }
    });

    this.options = {
      gridType: GridType.VerticalFixed,
      compactType: CompactType.None,
      margin: 10,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 640,
      minCols: 12,
      maxCols: 12,
      minRows: 50,
      maxRows: 100,
      maxItemCols: 12,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 105,
      fixedRowHeight: 14,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      allowMultiLayer: true,
      defaultLayerIndex: 2,
      baseLayerIndex: 2,
      maxLayerIndex: 2,
      swap: false,
      pushItems: true,
      disablePushOnDrag: true,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      pushResizeItems: false,
      displayGrid: DisplayGrid.Always,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false,
      draggable: {
        enabled: true,
        dropOverItems: true,
        dropOverItemsCallback: (
          source: GridsterItem,
          target: GridsterItem,
          grid: GridsterComponentInterface
        ) => {
          this.dropOverItem(source, target);
        },
        start: (item, gridsterItem, event) => {
          /* @ts-ignore-nextline */
          const parentGridsterItem = event.target.closest('gridster-item');

          if (parentGridsterItem) {
            parentGridsterItem.style.zIndex = 1000;
          }

          this.dashboardChange.x = gridsterItem.$item.x;
          this.dashboardChange.y = gridsterItem.$item.y;
        },
        stop: (item, gridsterItem, event) => {
          /* @ts-ignore-nextline */
          const parentGridsterItem = event.target.closest('gridster-item');

          if (parentGridsterItem) {
            parentGridsterItem.style.zIndex = '';
          }

          if (
            this.dashboardChange.x !== gridsterItem.$item.x ||
            this.dashboardChange.y !== gridsterItem.$item.y
          ) {
            this.changingDashboard(item);
          }

          this.dashboardChange.x = -1;
          this.dashboardChange.y = -1;
        },
      },
      resizable: {
        enabled: true,
        start: (item, gridsterItem, event) => {
          this.dashboardChange.rows = gridsterItem.$item.rows;
          this.dashboardChange.cols = gridsterItem.$item.cols;
        },
        stop: (item, gridsterItem, event) => {
          if (
            this.dashboardChange.rows !== gridsterItem.$item.rows ||
            this.dashboardChange.cols !== gridsterItem.$item.cols
          ) {
            this.changingDashboard(item);
          }

          this.dashboardChange.rows = -1;
          this.dashboardChange.cols = -1;
        },
      },
      itemResizeCallback: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => {
        if (item.content?.type === 'tabs') {
          const height = itemComponent.$item.rows * 20 * 1.18 - 90 + 'px';
          this.tabHeightSettings[itemComponent.item.id] = height;
        }
        if (item.content?.graph) {
          setTimeout(() => {
            this.resizeChart(item, itemComponent);
          }, 200);
        }
      },
      // itemChangeCallback: (
      //  item: GridsterItem,
      //  itemComponent: GridsterItemComponentInterface,
      // ) => {
      //  this.changingDashboard(item, itemComponent);
      // },
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      enableOccupiedCellDrop: false,
    };

    this.optionsForTabs = clonedeep(this.options);

    this.dashboard = [];

    this.store.pipe(takeUntil(this._destroy$), select('chartDetail')).subscribe((res) => {
      if (res.data) {
        const newDashboards = res.data.result.dashboards.map((item) => item.id);

        if (
          this.deletedCharts.has(res.data.id) &&
          newDashboards.includes(parseInt(this.dashboardId, 10))
        ) {
          this.store.dispatch(
            ChartDeleteDashboard({
              payload: {
                chartId: res.data.id,
                dashboardId: parseInt(this.dashboardId, 10),
              },
            })
          );
          return;
        }

        if (
          !this.deletedCharts.has(res.data.id) &&
          !newDashboards.includes(parseInt(this.dashboardId, 10))
        ) {
          this.store.dispatch(
            ChartAddDashboard({
              payload: {
                chartId: res.data.id,
                dashboardId: parseInt(this.dashboardId, 10),
              },
            })
          );
          return;
        }
      }
    });

    this.store.pipe(takeUntil(this._destroy$), select('chartDetailData')).subscribe((res) => {
      this.loading = true;

      if (res.data) {
        const chartDataComplete = {
          chartId: res.chartData.sliceId,
          chartName: res.chartData.sliceName,
          chartType: res.chartData.sliceType,
          data: res.data.result[0],
        };
        this.chartsFromDashboardData[res.chartData.sliceId] = {
          chartId: res.chartData.sliceId,
          chartName: res.chartData.sliceName,
          chartType: this.chartTypeDict[res.chartData.sliceType],
          chartSubheader: res.chartData.sliceSubheader,
          // graph: this.configGraph(chartDataComplete,
          // res.chartData.sliceName)
          graph: this.chartOptionService.configChart(chartDataComplete),
        };

        const chart = this.dashboardPosition?.position?.find(
          (item) => item.id === res.chartData.sliceId
        );
        if (chart) {
          this.dashboard.push(
            clonedeep({
              id: nanoid(),
              x: chart.x,
              y: chart.y,
              cols: chart.cols,
              rows: chart.rows,
              content: {
                chartId: res.chartData.sliceId,
                chartName: chart.name || res.chartData.sliceName,
                chartType: this.chartTypeDict[res.chartData.sliceType],
                chartSubheader: res.chartData.sliceSubheader,
                // graph: this.configGraph(chartDataComplete,
                // res.chartData.sliceName)
                graph: this.chartOptionService.configChart(chartDataComplete),
              },
            })
          );
        } else {
          this.dashboard.push(
            clonedeep({
              id: nanoid(),
              x: 0,
              y: 0,
              cols: 5,
              rows: 20,
              content: {
                chartId: res.chartData.sliceId,
                chartName: res.chartData.sliceName,
                chartType: this.chartTypeDict[res.chartData.sliceType],
                chartSubheader: res.chartData.sliceSubheader,
                // graph: this.configGraph(chartDataComplete,
                // res.chartData.sliceName)
                graph: this.chartOptionService.configChart(chartDataComplete),
              },
            })
          );
        }
        this.deletedCharts.delete(res.chartData.sliceId);
        this.initChartCount--;

        if (this.initChartCount < 0) {
          this.loading = false;
        }

        if (this.initChartCount === 0) {
          this.loadGridItems();
        }
      }
    });

    this.chartsFilter
      .get('quicksearch')
      .valueChanges.pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((value) => {
        this.onQuicksearch(value);
      });
  }

  public onPageChange(evt: any): void {
    this.paginator.pageSize = evt.pageSize;
    this.paginator.currentPage = evt.pageIndex;
    this.paginator.skip = evt.skip;

    this.loadCharts();
  }

  public addTab(itemIndex: number): void {
    this.saveDashboardHistoryLeft({
      type: DashboardActions.modified,
      item: this.dashboard[itemIndex],
    });

    this.dashboard[itemIndex].content.tabs.push(
      clonedeep({
        elementTabItemIndex: nanoid(),
        title: `Вкладка ${this.dashboard[itemIndex].content.tabs.length + 1}`,
        items: [],
        options: {
          ...this.optionsForTabs,
          displayGrid: this.showGrid ? DisplayGrid.Always : DisplayGrid.None,
        },
      })
    );

    // next tick
    setTimeout(() => {
      this.dashboard[itemIndex].content.tabs[
        this.dashboard[itemIndex].content.tabs.length - 1
      ].options.api.resize();

      const tabAdded =
        this.dashboard[itemIndex].content.tabs[this.dashboard[itemIndex].content.tabs.length - 1];

      const $tabItem = document.querySelector(`#${tabAdded.elementTabItemIndex}`);
      const $tabLabel = $tabItem?.closest('.mat-tab-label') as any;
      $tabLabel?.click();
    });
  }

  public removeTab(tabIndex: number, itemIndex: number): void {
    this.saveDashboardHistoryLeft({
      type: DashboardActions.modified,
      item: this.dashboard[itemIndex],
    });

    this.dashboard[itemIndex].content.tabs.splice(tabIndex, 1);
    this.recalculateTabsIndexes(itemIndex);
  }

  private recalculateTabsIndexes(itemIndex: number): void {
    this.dashboard[itemIndex].content.tabs.forEach((tab, tabIndex: number) => {
      // /и/ - fix странного поведения табов:
      // при восстановлении названия из истории вставляло "Вкладки".
      const regexp = /вкладк(а \d+?|и)$/i;

      if (tab.title.length === 0 || regexp.test(tab.title)) {
        tab.title = `Вкладка ${tabIndex + 1}`;
      }
    });
  }

  public headerTabTitleFocus($event, item: GridsterItem, tabIndex: number, key: string): void {
    const titlePrevious = item.content[key];
    this.dashboardChange.title = item.content[key];

    const fn = (e: any) => {
      if (
        e.target.closest('.edit-container') &&
        !e.target.closest('.js-tabs-component-input') &&
        titlePrevious !== $event.target.value
      ) {
        window.removeEventListener('pointerdown', fn);
        this.headerTabTitleChanged(item, tabIndex, key);
      }
    };

    window.addEventListener('pointerdown', fn);
  }

  public headerTabTitleChanged(item: GridsterItem, tabIndex: number, key: string): void {
    if (item.content.tabs[tabIndex].title.length === 0) {
      item.content.tabs[tabIndex].title = `Вкладка ${tabIndex + 1}`;
    }

    const itemToSave = clonedeep(item);
    itemToSave.content.tabs[tabIndex][key] = this.dashboardChange.title;

    this.saveDashboardHistoryLeft({
      type: DashboardActions.modified,
      item: itemToSave,
    });
  }

  public headerTitleFocus(item: GridsterItem, key: string): void {
    this.dashboardChange.title = item.content[key];
  }

  public headerTitleBlur(): void {
    this.dashboardChange.title = '';
  }

  public headerTitleChanged(item: GridsterItem, key: string): void {
    const itemToSave = clonedeep(item);
    itemToSave.content[key] = this.dashboardChange.title;

    this.saveDashboardHistoryLeft({
      type: DashboardActions.modified,
      item: itemToSave,
    });
  }

  public headerComponentTitleChanged(item: GridsterItem): void {
    this.saveDashboardHistoryLeft({
      type: DashboardActions.modified,
      item,
    });
  }

  // Срабатывает после измения: положения, размеров у дашборда.
  changingDashboard(item: GridsterItem): void {
    this.saveDashboardHistoryLeft({
      type: DashboardActions.modified,
      item,
    });
  }

  dropOverItem(source, target): void {
    if (target.content.type === 'tabs') {
      const item = this.dashboard.find((x) => x.y === target.y && x.x === target.x);

      // todo изменение положения графика в табе -> сохранять в историю,
      //   чтобы можно было отменять/восстанавливать изменения.
      this.saveDashboardHistoryLeft({
        type: DashboardActions.modified,
        item,
      });

      item.content.tabs[item.content.selected].items.push(
        clonedeep({
          x: 0,
          y: 0,
          cols: source.cols,
          rows: source.rows,
          content: source.content,
        })
      );

      this.dashboard = this.dashboard.filter((obj) => !(obj.x === source.x && obj.y === source.y));
    } else {
      // с помощью координат target и source определяем ориентацию слоя-фона
      // горизонтальная ориентация, когда тянем влево вверх

      if (source.y < target.y + target.rows && source.x >= target.x + target.cols) {
        this.dashboard.push(
          clonedeep({
            id: nanoid(),
            x: target.x,
            y: target.y,
            cols: target.cols + source.cols,
            rows: Math.max(target.rows, source.rows),
            layerIndex: 1,
            itemType: 'layer',
          })
        );
      } else if (source.y >= target.y + target.rows && source.x < target.x + target.cols) {
        // вертикальная ориентация, влево вверх
        this.dashboard.push(
          clonedeep({
            id: nanoid(),
            x: target.x,
            y: target.y,
            cols: Math.max(target.cols, source.cols),
            rows: target.rows + source.rows,
            layerIndex: 1,
            itemType: 'layer',
          })
        );
      } else if (source.y >= target.y - target.cols && source.x < target.x) {
        // горизонтальная ориентация, вправо вниз
        this.dashboard.push(
          clonedeep({
            id: nanoid(),
            x: target.x - source.cols < 0 ? 0 : target.x - source.cols,
            y: target.y,
            cols: target.cols + source.cols,
            rows: Math.max(target.rows, source.rows),
            layerIndex: 1,
            itemType: 'layer',
          })
        );
      } else if (source.y < target.y + target.rows && source.x >= target.x) {
        // вертикальная ориентация, вправо вниз
        this.dashboard.push(
          clonedeep({
            id: nanoid(),
            x: target.x,
            y: target.y - source.rows,
            cols: Math.max(target.cols, source.cols),
            rows: target.rows + source.rows,
            layerIndex: 1,
            itemType: 'layer',
          })
        );
      }

      this.saveDashboardHistoryLeft({
        type: DashboardActions.added,
        item: this.dashboard[this.dashboard.length - 1],
      });
    }
  }

  loadGridItems(): void {
    if (this.dashboardPosition?.position) {
      const dashboard = this.dashboard;
      this.loading = true;
      this.dashboard = [];

      for (const element of this.dashboardPosition.position) {
        if (element?.component) {
          this.dashboard.push(
            clonedeep({
              id: nanoid(),
              x: element.x,
              y: element.y,
              cols: element.cols,
              rows: element.rows,
              content: element.meta,
            })
          );
          continue;
        }

        const currentChart = dashboard.find((chart) => element.id === chart.content?.chartId);

        if (currentChart) {
          this.dashboard.push(
            clonedeep({
              id: nanoid(),
              x: element.x,
              y: element.y,
              cols: element.cols,
              rows: element.rows,
              content: currentChart.content,
            })
          );
        }
      }

      this.loading = false;
    }
  }

  addChartInfo(chart: any, body: any): void {
    if (
      chart.form_data.viz_type === 'big_number_total' ||
      chart.form_data.viz_type === 'big_number'
    ) {
      this.store.dispatch(
        ChartDetailDataPost({
          formData: {
            sliceId: chart.form_data.slice_id,
            sliceName: chart.slice_name,
            sliceType: chart.form_data.viz_type,
            sliceSubheader: chart.form_data.subheader,
          },
          body,
        })
      );
    } else if (chart.form_data.bar_stacked) {
      this.store.dispatch(
        ChartDetailDataPost({
          formData: {
            sliceId: chart.form_data.slice_id,
            sliceName: chart.slice_name,
            sliceType: 'bar_stacked',
          },
          body,
        })
      );
    } else if (chart.form_data.stack) {
      this.store.dispatch(
        ChartDetailDataPost({
          formData: {
            sliceId: chart.form_data.slice_id,
            sliceName: chart.slice_name,
            sliceType: 'bar_stacked_plan',
          },
          body,
        })
      );
    } else {
      this.store.dispatch(
        ChartDetailDataPost({
          formData: {
            sliceId: chart.form_data.slice_id,
            sliceName: chart.slice_name,
            sliceType: chart.form_data.viz_type,
          },
          body,
        })
      );
    }
  }

  removeItem(item): void {
    const itemIndex = this.dashboard.findIndex(({ id }) => id === item.id);

    if (itemIndex > -1) {
      this.saveDashboardHistoryLeft({
        type: DashboardActions.deleted,
        item,
      });

      this.dashboard.splice(itemIndex, 1);

      if (!item.content?.component) {
        this.deletedCharts.add(item.content.chartId);
      }
    }
  }

  removeItemFromTab(itemIndex, tabIndex, tabsIndex): void {
    const item = this.dashboard[tabsIndex];

    this.saveDashboardHistoryLeft({
      type: DashboardActions.deleted,
      item,
    });

    this.dashboard[tabsIndex].content.tabs[tabIndex].items.splice(itemIndex, 1);
  }

  addItem(): void {
    this.dashboard.push(clonedeep({ x: 0, y: 0, cols: 1, rows: 1 }));

    this.saveDashboardHistoryLeft({
      type: DashboardActions.added,
      item: this.dashboard[this.dashboard.length - 1],
    });
  }

  onButtonCancelClick(): void {
    // this.cancelEdit.emit({ dashboardInfo: null });
    this.router.navigate([`/main/dashboard/${this.dashboardId}/`]);
  }

  onButtonSaveClick(owners?: number[]): void {
    this.loading = true;

    // меняем графики, чтобы они были прикреплены к дашборду, а также создаем
    const rowHeight = 14;
    const positionJson = {
      type: 'new',
      position: [],
    };

    for (const item of this.dashboard) {
      if (!item.content?.component && item?.itemType !== 'layer') {
        this.store.dispatch(
          ChartDetailGet({
            id: item.content.chartId,
            q: {},
          })
        );

        positionJson.position.push(
          clonedeep({
            id: item.content.chartId,
            name: item.content.chartName,
            x: item.x,
            y: item.y,
            rows: item.rows,
            cols: item.cols,
          })
        );
      }

      if (item.itemType === 'layer') {
        positionJson.position.push(
          clonedeep({
            layer: true,
            x: item.x,
            y: item.y,
            rows: item.rows,
            cols: item.cols,
          })
        );
      } else if (item.content.component) {
        if (item.content?.type === 'tabs') {
          item.content.tabs.forEach((element) => {
            element.items.forEach((item) => {
              if (!item.content?.component) {
                this.store.dispatch(
                  ChartDetailGet({
                    id: item.content.chartId,
                    q: {},
                  })
                );
              }
            });
          });
        }
        positionJson.position.push(
          clonedeep({
            component: true,
            meta: item.content,
            x: item.x,
            y: item.y,
            rows: item.rows,
            cols: item.cols,
          })
        );
      }
    }

    for (const id of this.deletedCharts) {
      // todo требуется дождаться завершения всех событий, добавить для этого счетчик.
      this.store.dispatch(ChartDetailGet({ id, q: {} }));
    }

    // todo оч плохая практика. Зачем нужно?
    setTimeout(() => {
      // this.cancelEdit.emit({
      //   dashboardInfo: {
      //     name: this.name.value,
      //     positionJson: JSON.stringify(positionJson),
      //   },
      // });
      const payload: any = {
        dashboard_title: this.name.value,
        position_json: JSON.stringify(positionJson),
      };
      if (owners) {
        payload.owners = owners;
      }
      this.store.dispatch(
        DashboardDetailUpdate({
          id: this.dashboardId,
          payload,
        })
      );
      // await this.router.navigate([`/main/dashboard/${this.dashboardId}/`]);
    }, 2000);
  }

  onTabChange(e: any): void {
    // if (e.tab.textLabel === 'Графики') {
    //   this.loadCharts();
    // }
  }

  onEditMarkdown(id): void {
    if (this.editMarkdown === -1) {
      this.editMarkdown = id;
    } else {
      this.editMarkdown = -1;
    }
  }

  onEditHeader(id, size, background): void {
    if (this.editHeader === id) {
      this.editHeader = -1;
    } else {
      this.editHeader = id;
      this.editHaderSize = size;
      this.editHeaderBackground = background;
    }
  }

  onStopEditChartTitle(event, id): void {
    const chartIndex = this.dashboard.findIndex((elem) => elem.content.chartId === id);

    if (chartIndex === -1) {
      this.dashboard.forEach((dashboard) => {
        if (dashboard.content.type === 'tabs') {
          dashboard.content.tabs.forEach((tab) => {
            tab.items.forEach((chart) => {
              if (chart.content.chartId === id) {
                chart.content.chartName = event.target.value;
                this.editChartTitleId = 0;

                this.saveDashboardHistoryLeft({
                  type: DashboardActions.modified,
                  item: chart,
                });
              }
            });
          });
        }
      });
    }

    if (chartIndex > -1) {
      this.saveDashboardHistoryLeft({
        type: DashboardActions.modified,
        item: this.dashboard[chartIndex],
      });

      this.dashboard[chartIndex].content.chartName = event.target.value;
      this.editChartTitleId = 0;
    }
  }

  onChangeSelectedTab(tabIndex, dashboardIndex): void {
    this.dashboard[dashboardIndex].content.selected = tabIndex;

    this.dashboard[dashboardIndex].content.tabs.forEach((tab) => {
      tab.options.api.resize();
    });
  }

  loadCharts(): void {
    // if (!this.chartList) {
    if (this.chartsFilterValue) {
      this.store.dispatch(
        ChartListMSGet({
          payload: {
            order_column: this.chartsSort.col,
            order_direction: this.chartsSort.direction,
            page_size: this.paginator.pageSize,
            page: this.paginator.currentPage,
            filters: [
              {
                col: 'slice_name',
                opr: 'ct',
                value: this.chartsFilterValue,
              },
              {
                col: 'owners',
                opr: 'rel_m_m',
                value: this.userId,
              },
            ],
          },
        })
      );
    } else {
      this.store.dispatch(
        ChartListMSGet({
          payload: {
            order_column: this.chartsSort.col,
            order_direction: this.chartsSort.direction,
            page_size: this.paginator.pageSize,
            page: this.paginator.currentPage,
            filters: [
              {
                col: 'owners',
                opr: 'rel_m_m',
                value: this.userId,
              },
            ],
          },
        })
      );
    }
    // }
  }

  onSortCharts(event): void {
    // this.chartListFiltered = this.sortByKey([...this.chartListFiltered],
    // event.value);
    this.chartsSort.col = event.value;
    if (event.value === 'changed_on_delta_humanized') {
      this.chartsSort.direction = 'desc';
    } else {
      this.chartsSort.direction = 'asc';
    }
    this.chartsFilterValue = '';
    this.chartsFilter.get('quicksearch').setValue('');
    this.store.dispatch(
      ChartListMSGet({
        payload: {
          order_column: this.chartsSort.col,
          order_direction: this.chartsSort.direction,
          page_size: this.paginator.pageSize,
          page: 0,
          filters: [
            {
              col: 'owners',
              opr: 'rel_m_m',
              value: this.userId,
            },
          ],
        },
      })
    );
    this.paginator.currentPage = 0;
  }

  sortByKey(array, key): number {
    return array.sort((a, b) => {
      const x = a[key];
      const y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  onQuicksearch(event): void {
    this.chartsFilterValue = event.toLowerCase();
    this.loadCharts();
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer !== event.container) {
      if (event.item.data?.component) {
        if (event.item.data.type === 'delimeter') {
          this.dashboard.push(
            clonedeep({
              id: nanoid(),
              x: 0,
              y: 0,
              cols: 12,
              rows: 2,
              content: event.item.data,
              resizeEnabled: false,
            })
          );
        } else if (event.item.data.type === 'header') {
          this.dashboard.push(
            clonedeep({
              id: nanoid(),
              x: 0,
              y: 0,
              cols: 12,
              rows: 4,
              content: event.item.data,
              resizeEnabled: false,
            })
          );
        } else if (event.item.data.type === 'markdown') {
          this.dashboard.push(
            clonedeep({
              id: nanoid(),
              x: 0,
              y: 0,
              cols: 4,
              rows: 10,
              content: event.item.data,
            })
          );
        } else if (event.item.data.type === 'tabs') {
          // todo ХРОМ при первой вставке табера не выделает первый таб,
          // а последующие добавления - выделяет.
          event.item.data.selected = 0;

          event.item.data.tabs[0].options = clonedeep({
            ...this.optionsForTabs,
            displayGrid: this.showGrid ? DisplayGrid.Always : DisplayGrid.None,
          });

          this.dashboard.push(
            clonedeep({
              id: nanoid(),
              x: 0,
              y: 0,
              cols: 12,
              rows: 20,
              content: event.item.data,
            })
          );
        }

        this.saveDashboardHistoryLeft({
          type: DashboardActions.added,
          item: this.dashboard[this.dashboard.length - 1],
        });
      } else {
        console.log('refactor: chart add else');
        // copyArrayItem(event.previousContainer.data,
        //                   event.container.data,
        //                   event.previousIndex,
        //                   event.currentIndex);

        const body = clonedeep(
          this.createChartPostBody(event.item.data)
        ) as unknown as GridsterItem;

        this.saveDashboardHistoryLeft({
          type: DashboardActions.added,
          item: { ...body, savedItem: event.item.data },
        });

        // this.store.dispatch(ChartDetailDataPost({
        //   formData: {
        //     sliceId: event.item.data.id,
        //     sliceName: event.item.data.slice_name,
        //     sliceType: event.item.data.viz_type,
        //   },
        //   body,
        // }));
        if (
          event.item.data.viz_type === 'big_number_total' ||
          event.item.data.viz_type === 'big_number'
        ) {
          this.store.dispatch(
            ChartDetailDataPost({
              formData: {
                sliceId: event.item.data.id,
                sliceName: event.item.data.slice_name,
                sliceType: event.item.data.viz_type,
                sliceSubheader: body.queries[0].subheader,
              },
              body,
            })
          );
        } else if (body.queries[0].bar_stacked) {
          this.store.dispatch(
            ChartDetailDataPost({
              formData: {
                sliceId: event.item.data.id,
                sliceName: event.item.data.slice_name,
                sliceType: 'bar_stacked',
              },
              body,
            })
          );
        } else if (body.queries[0].stack) {
          this.store.dispatch(
            ChartDetailDataPost({
              formData: {
                sliceId: event.item.data.id,
                sliceName: event.item.data.slice_name,
                sliceType: 'bar_stacked_plan',
              },
              body,
            })
          );
        } else {
          this.store.dispatch(
            ChartDetailDataPost({
              formData: {
                sliceId: event.item.data.id,
                sliceName: event.item.data.slice_name,
                sliceType: event.item.data.viz_type,
              },
              body,
            })
          );
        }
      }
      // this.dashboard.push(clonedeep({ x: 0, y: 0, cols: 3, rows: 25, content:
      // event.item.data }));
    }
  }

  createChartPostBody(chart): any {
    const queries = JSON.parse(chart.params);

    if (queries.metric) {
      queries.metrics = [queries.metric];
      // delete queries.metric;
    }

    if (queries.secondary_metric) {
      queries.metrics.push(clonedeep(queries.secondary_metric));
    }

    if (queries.datasource) {
      delete queries.datasource;
    }

    if (
      queries.granularity_sqla &&
      chart.viz_type !== 'big_number_total' &&
      chart.viz_type !== 'sunburst' &&
      chart.viz_type !== 'pie'
    ) {
      queries.granularity = queries.granularity_sqla;
      // if (queries.bar_stacked || queries.stack) {
      queries.columns = [queries.granularity, '__timestamp'];
      // } else {
      // queries.columns = [queries.granularity];
      // }

      delete queries.granularity_sqla;
    }

    if (chart.viz_type === 'bubble') {
      queries.columns = [
        queries.entity,
        queries.size.column.column_name,
        queries.x.column.column_name,
        queries.y.column.column_name,
      ];
      queries.groupby = [queries.entity];
      queries.metrics = [queries.size, queries.x, queries.y];
    }

    const body = {
      datasource: {
        id: chart.datasource_id,
        type: chart.datasource_type,
      },
      queries: [queries],
      result_format: 'json',
      result_type: 'full',
    };

    return body;
  }

  saveDashboardHistoryLeft({ type, item }: { type: DashboardActions; item: GridsterItem }): void {
    this.dashboardHistoryLeft.push(clonedeep({ type, item }));

    if (DashboardActions.added === type || DashboardActions.modified === type) {
      this.dashboardHistoryRight = [];
    }
  }

  // todo как вернуть график из таба?
  //  график находится в табе, его нужно вынуть и положить в дашборд.
  //  как вынуть: найти тот (в action?), которого нет в дашборде и его вставить?
  // console.log('action', action.item.content.tabs[0].items[0]);
  // ??? при добавлении в таб именно сам элемент складывать в еще один буффер истории
  //   их будет так же две штуки: левый и правый по аналогии с историей дашборда.
  undoChange(): void {
    if (this.dashboardHistoryLeft.length === 0) {
      return;
    }

    const action = this.dashboardHistoryLeft.pop();

    if (DashboardActions.added === action.type) {
      action.type = DashboardActions.deleted;
      this.dashboardHistoryRight.push(clonedeep(action));
      this.dashboard.pop();
    } else if (DashboardActions.modified === action.type) {
      const itemIndex = this.getDashboardModifiedIndex(action);

      if (itemIndex > -1) {
        this.dashboardHistoryRight.push(
          clonedeep({
            type: DashboardActions.modified,
            item: this.dashboard[itemIndex],
          })
        );

        this.dashboard.splice(itemIndex, 1, clonedeep(action.item));

        if (action.item.content?.type === 'tabs') {
          this.recalculateTabsIndexes(itemIndex);
        }
      }
    } else if (DashboardActions.deleted === action.type) {
      action.type = DashboardActions.added;
      this.dashboardHistoryRight.push(clonedeep(action));
      this.dashboard.push(clonedeep(action.item));
    } else {
      console.log('undoChange / Необработанное действие!', action);
    }
  }

  getDashboardModifiedIndex(action: IDashboardHistory): number {
    let itemIndex = -1;

    for (let i = this.dashboard.length - 1; i > -1; i -= 1) {
      if (this.dashboard[i].id === action.item.id) {
        itemIndex = i;
        break;
      }
    }

    return itemIndex;
  }

  returnCanceledChange(): void {
    if (this.dashboardHistoryRight.length === 0) {
      return;
    }

    const action = this.dashboardHistoryRight.pop();

    if (DashboardActions.deleted === action.type) {
      action.type = DashboardActions.added;
      this.dashboardHistoryLeft.push(clonedeep(action));

      if (action.item.content?.component) {
        this.dashboard.push(clonedeep(action.item));
      } else {
        this.restoringGraphFromHistory(action);
      }
    } else if (DashboardActions.modified === action.type) {
      const itemIndex = this.getDashboardModifiedIndex(action);

      if (itemIndex > -1) {
        this.dashboardHistoryLeft.push(
          clonedeep({
            type: DashboardActions.modified,
            item: this.dashboard[itemIndex],
          })
        );

        this.dashboard.splice(itemIndex, 1, clonedeep(action.item));
      }
    } else if (DashboardActions.added === action.type) {
      action.type = DashboardActions.deleted;
      this.dashboardHistoryLeft.push(clonedeep(action));
      this.dashboard.pop();
    } else {
      console.log('returnCanceledChange / Необработанное действие!', action);
    }
  }

  // Аналог метода drop:else с правками для восстановления из истории.
  restoringGraphFromHistory(action: IDashboardHistory): void {
    const [queries] = action.item.queries;
    const savedItem = action.item.savedItem;

    if (queries.metric) {
      queries.metrics = [queries.metric];
      // delete queries.metric;
    }

    if (queries.secondary_metric) {
      queries.metrics.push(clonedeep(queries.secondary_metric));
    }

    if (queries.datasource) {
      delete queries.datasource;
    }

    if (
      queries.granularity_sqla &&
      savedItem.viz_type !== 'big_number_total' &&
      savedItem.viz_type !== 'sunburst' &&
      savedItem.viz_type !== 'pie'
    ) {
      queries.granularity = queries.granularity_sqla;
      // if (queries.bar_stacked || queries.stack) {
      queries.columns = [queries.granularity, '__timestamp'];
      // } else {
      // queries.columns = [queries.granularity];
      // }

      delete queries.granularity_sqla;
    }

    if (savedItem.viz_type === 'bubble') {
      queries.columns = [
        queries.entity,
        queries.size.column.column_name,
        queries.x.column.column_name,
        queries.y.column.column_name,
      ];
      queries.groupby = [queries.entity];
      queries.metrics = [queries.size, queries.x, queries.y];
    }

    const body = {
      datasource: {
        id: savedItem.datasource_id,
        type: savedItem.datasource_type,
      },
      queries: [queries],
      result_format: 'json',
      result_type: 'full',
    };
    if (savedItem.viz_type === 'big_number_total' || savedItem.viz_type === 'big_number') {
      this.store.dispatch(
        ChartDetailDataPost({
          formData: {
            sliceId: savedItem.id,
            sliceName: savedItem.slice_name,
            sliceType: savedItem.viz_type,
            sliceSubheader: queries.subheader,
          },
          body,
        })
      );
    } else if (queries.bar_stacked) {
      this.store.dispatch(
        ChartDetailDataPost({
          formData: {
            sliceId: savedItem.id,
            sliceName: savedItem.slice_name,
            sliceType: 'bar_stacked',
          },
          body,
        })
      );
    } else if (queries.stack) {
      this.store.dispatch(
        ChartDetailDataPost({
          formData: {
            sliceId: savedItem.id,
            sliceName: savedItem.slice_name,
            sliceType: 'bar_stacked_plan',
          },
          body,
        })
      );
    } else {
      this.store.dispatch(
        ChartDetailDataPost({
          formData: {
            sliceId: savedItem.id,
            sliceName: savedItem.slice_name,
            sliceType: savedItem.viz_type,
          },
          body,
        })
      );
    }
  }

  onChartInit(event: any, chartId: number, element): void {
    if (chartId) {
      element.content.selfChartId = `${chartId}_${nanoid()}`;
      this.chartsDom[element.content.selfChartId] = event;
    }
  }

  resizeChart(item, itemComponent): void {
    const { selfChartId } = item.content;

    if (this.chartsDom[selfChartId]) {
      this.chartsDom[selfChartId].resize({
        width: itemComponent.width,
        height: itemComponent.height - 60,
      });

      // Вызывать saveDashboardHistoryLeft не нужно,
      // так как есть слушатель изменения размеров.
    }
  }

  onToggleShowGrid(): void {
    this.showGrid = !this.showGrid;

    if (this.showGrid) {
      this.options.displayGrid = DisplayGrid.Always;
      this.setDisplayGridForTabs(DisplayGrid.Always);
    } else {
      this.options.displayGrid = DisplayGrid.None;
      this.setDisplayGridForTabs(DisplayGrid.None);
    }

    this.options.api.optionsChanged();
  }

  private setDisplayGridForTabs(displayGrid): void {
    this.dashboard.forEach((item) => {
      if (item.content.type === 'tabs') {
        item.content.tabs.forEach((tab) => {
          tab.options.displayGrid = displayGrid;
          tab.options.api.optionsChanged();
        });
      }
    });
  }

  headerSizeChange(event, itemIndex: number): void {
    this.saveDashboardHistoryLeft({
      type: DashboardActions.modified,
      item: this.dashboard[itemIndex],
    });

    this.dashboard[itemIndex].content.size = this.headerSizes[event];
  }

  headerBackgroundChange(event, itemIndex: number): void {
    this.dashboard[itemIndex].content.background = event;
  }

  onSaveEditHeader(): void {
    this.editHeader = -1;
  }

  onCloseEditHeader(index): void {
    this.editHeader = -1;
    this.dashboard[index].content.background = this.editHeaderBackground;
    this.dashboard[index].content.size = this.editHaderSize;
  }

  editTabTitleClick(itemIndex, tabIndex): void {
    this.editTabTitle = [itemIndex, tabIndex];
  }

  publishDashboard(): void {
    this.isPublished = !this.isPublished;
    this.store.dispatch(
      DashboardDetailUpdate({
        id: this.dashboardId,
        payload: {
          published: this.isPublished,
        },
      })
    );
  }

  setFavoriteStatus(): void {
    this.store.dispatch(
      DashboardSetFavoriteStatus({
        payload: {
          data: [parseInt(this.dashboardId, 10)],
          select: !this.favoriteStatus,
          callback: () => {
            this.store.dispatch(
              DashboardDetailFavoriteStatusListGet({
                payload: { ids: [parseInt(this.dashboardId, 10)] },
              })
            );
          },
        },
      })
    );
  }

  // Если сдвинули мышь при зажатом ЛКМ, то значит это было выделение и нужно отменить
  // перемещение гридстер-элемента.
  public chartTitleSelectStart($event, chartId: number): void {
    $event.stopPropagation();

    const threshold = 5; // Примерно 1 символ.
    let movingPixels = $event.clientX;

    const pointermove = (e) => {
      movingPixels = e.clientX;
    };

    const pointerup = () => {
      $event.target.removeEventListener('mousemove', pointermove);
      $event.target.removeEventListener('mouseup', pointerup);

      if (Math.abs($event.clientX - movingPixels) < threshold) {
        this.editChartTitleId = chartId;
      }
    };

    $event.target.addEventListener('mousemove', pointermove);
    $event.target.addEventListener('mouseup', pointerup);

    // При клике по заголовку элемент появляется в DOM, ему нужно время инициализироваться.
    setTimeout(() => {
      window['globalChartNameInput']?.focus();
    }, 100);
  }

  public openOwnersPopup() {
    const dialogRef = this.dialog.open(PopupDashboardOwnersComponent, {
      data: {
        selectedOwners: this.dashboardInfo.result.owners,
      },
    });

    dialogRef.afterClosed().subscribe((action) => {
      if (!action) {
        return;
      }
      this.onButtonSaveClick(action);
      this.editAfterSave = true;
    });
  }

  public onCopyLinkDashboardId(): void {
    const uri = `${location.origin}?c=${this.dashboardId}`;
    navigator.clipboard.writeText(uri);

    this._snackBar.openFromComponent(CopyLinkDashboardComponent, {
      duration: this.notifyDurationInSeconds * 1000,
    });
  }

  public onOpenDialogSendDashboardToEmail(): void {
    const dialogRef = this.dialog.open(DashboardDetailDialogComponent, {
      data: {
        title: 'Отправить через e-mail',
        isBlockSub: false,
        isEmailSub: false,
        frequency: -1,
        emails: [{ value: '' }],
      },
    });

    dialogRef.afterClosed().subscribe(async (e: any) => {
      if (e?.type === 'confirm') {
        await this.onSendLinkDashboardToEmail(e.data);
      }
    });
  }

  private async onSendLinkDashboardToEmail(data: any): Promise<void> {
    const title = this.dashboardInfo.result.dashboard_title;
    const href = `${location.origin}?c=${this.dashboardId}`;
    const html = `<a href="${href}" target="_blank">Ссылка на график</a>`;

    await this.sendLinkToEmailFn({
      data,
      title,
      html,
    });
  }

  private async sendLinkToEmailFn({
    data,
    title,
    html,
  }: {
    data: any;
    title: string;
    html: string;
  }): Promise<void> {
    const formData = new FormData();
    formData.append('username', localStorage.getItem('username'));
    formData.append('emails', JSON.stringify(data.emails));
    formData.append('frequency', data.frequency > -1 ? data.frequency : 1);
    formData.append('title', title);
    formData.append('html', html);

    if (data.isEmailSub) {
      formData.append('isEmailSub', data.isEmailSub);
      formData.append('dashboardId', String(this.dashboardId));
    }

    try {
      await this.postData(formData);

      this._snackBar.openFromComponent(EmailSendedComponent, {
        duration: this.notifyDurationInSeconds * 1000,
      });
    } catch (err) {
      console.log('Не удалось отправить письмо', err);

      this._snackBar.openFromComponent(EmailSendedErrorComponent, {
        duration: this.notifyDurationInSeconds * 1000,
      });
    }
  }

  async postData(formData: FormData): Promise<any> {
    return await fetch(`${environment.APIForSendingEmails}/email`, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: formData,
    });
  }

  reloadDashboard() {
    this.store.dispatch(ChartClear());
    this.store.dispatch(DashboardClear());
    this.store.dispatch(DashboardDetailGet({ id: this.dashboardId, q: {} }));
  }

  setAutoRefreshIntervalClick() {
    const dialogRef = this.dialog.open(DashboardAutorefreshDialogComponent, {
      data: this.autoRefreshValue,
    });

    dialogRef.afterClosed().subscribe((e: any) => {
      if (!e) {
        return;
      }

      if (!e.close && !e.data?.value && this.autoRefreshTimer) {
        Object.assign(this.autoRefreshValue, e.data);
        clearInterval(this.autoRefreshTimer);
      } else if (!e.close) {
        Object.assign(this.autoRefreshValue, e.data);
        clearInterval(this.autoRefreshTimer);
        this.autoRefreshTimer = window.setInterval(() => this.reloadDashboard(), e.data.value);
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this.store.dispatch(ChartClear());
    this.store.dispatch(DashboardClear());

    clearInterval(this.autoRefreshTimer);
  }
}
