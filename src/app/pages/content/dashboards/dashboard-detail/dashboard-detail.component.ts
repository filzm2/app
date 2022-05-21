import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import * as appState from '@store/reducers/index';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  DashboardClear,
  DashboardDetailChartGet,
  DashboardDetailFavoriteStatusListGet,
  DashboardDetailGet,
  DashboardViewed,
  DashboardDetailUpdate,
  DashboardSetFavoriteStatus,
  DashboardPin,
} from '@app/store/actions/dashboard/dashboard.actions';
import { selectDashboardCompleteDetailState } from '@app/store/selectors/dashboard/dashboard.selector';
import {
  ChartClear,
  ChartDetailDataPost,
  ChartDetailDataGetCSV,
} from '@app/store/actions/chart/chart.actions';
import { ChartOptionService } from '@app/core/services/chart-option.service';
import { ExportCsvService } from '@app/core/services/export-csv.service';
import { environment } from '@app/../environments/environment';

import { DashboardDetailDialogComponent } from './dashboard-detail-dialog';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { DashboardAutorefreshDialogComponent } from './components/dashboard-autorefresh-dialog/dashboard-autorefresh-dialog.component';
import { IDashboardIntervalType } from '@app/models/dashboard/dashboard.model';
import { selectAllPermissions } from '@app/store/selectors/security/security.selector';
import {
  DashboardCommentsGet,
  DashboardChartCommentsGet,
} from '@app/store/actions/dashboard/dashboard-comments.actions';

@Component({ template: '<span style="color: white;">Ссылка скопирована в буфер обмена</span>' })
export class CopyLinkDashboardComponent {}

@Component({
  template: '<span style="color: #EF8983;">Ссылка не скопирована в буфер обмена</span>',
})
export class CopyLinkDashboardErrorComponent {}

@Component({
  template: '<span style="color: white;">Ссылка на график скопирована в буфер обмена</span>',
})
export class CopyLinkChartComponent {}

@Component({
  template:
    '<span style="color: #EF8983;">Копирование ссылки для этого графика не предусмотрено</span>',
})
export class CopyLinkChartErrorComponent {}

@Component({ template: '<span style="color: white;">Ссылка на график отправлена</span>' })
export class EmailSendedComponent {}

@Component({ template: '<span style="color: #EF8983;">Ссылка на график не отправлена</span>' })
export class EmailSendedErrorComponent {}

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.scss'],
})
export class DashboardDetailComponent implements OnInit {
  public dashboardMaxWidth: number = window.innerWidth - 60;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.dashboardMaxWidth = event.target.innerWidth - 60;
  }

  private _destroy$ = new Subject<null>();
  public routerState: any;
  public editMode = false;
  public dashboardInfo: any;
  public dashboardChartsObject: any = {};
  public dashboardChartsGraph: Array<any> = [];
  public cssGrid: any = {};
  public dashboardId: string = '';
  public expandChart: boolean = false;
  public expandChartNew: boolean = false;
  public expandCssGrid: any = {};
  public expandChartObject: any = {};
  public expandItem: string = ''; // это itemId при открытии графика на весь экран.
  public loading = true;
  public dashboardChartsAmount = 0;
  public dashboardType = 'old';
  public chartIds: any = [];
  public favoriteStatus: boolean = false;
  public isFiltersShowed = false;
  public isPublished = false;
  public autoRefreshTimer: number;

  public openCommentIndex: number = -1;
  public dashboardCommentsObject: { [key: number]: number } = {};

  public filters = {
    time: '',
    list: [],
  };

  public chartsDom: object = {};

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
    // временное название, нужен был любой график-заглушка для хранения цифр плана/факта
    sunburst: 'sunburst',
  };

  public backgroundDict: any = {
    BACKGROUND_WHITE: 'white',
    BACKGROUND_TRANSPARENT: 'transparent',
  };

  public dashboardPermissions = {};
  public chartsCommentsForId = {};

  private notifyDurationInSeconds = 3;
  private chartsDatasComplete: Object = {};
  private chartsDatasCompleteForTabs: Object = {};

  private firstRoutingCheck = 1;

  private autoRefreshValue: IDashboardIntervalType = {
    value: 0,
    name: 'Не обновлять',
  };

  constructor(
    private store: Store<appState.State>,
    private chartOptionService: ChartOptionService,
    private exportCsvService: ExportCsvService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.store.pipe(takeUntil(this._destroy$), select('router')).subscribe((router) => {
      this.routerState = router;
      // this.editMode = router.state.queryParams?.edit;
      // console.log(router.state, this.editMode, 'router changed');

      if (router.state.params.id) {
        this.dashboardId = router.state.params.id.toString();
        this.store.dispatch(DashboardDetailGet({ id: this.dashboardId, q: {} }));
        this.store.dispatch(DashboardDetailChartGet({ id: this.dashboardId }));
        this.store.dispatch(
          DashboardDetailFavoriteStatusListGet({
            payload: { ids: [Number(this.dashboardId)] },
          })
        );
        this.store.dispatch(DashboardCommentsGet({ dashboardId: this.dashboardId }));
      }
    });

    this.store.pipe(takeUntil(this._destroy$), select('dashboardFavorite')).subscribe((res) => {
      if (res.data) {
        this.favoriteStatus = res.data[0].value;

        if (this.favoriteStatus) {
          // Отправляет 2 запроса...
          this.store.dispatch(DashboardViewed({ id: Number(this.dashboardId) }));
        }
      }
    });

    this.store.pipe(takeUntil(this._destroy$), select(selectAllPermissions)).subscribe((res) => {
      if (res.data) {
        // пока что нам только can_comment нужен, но скорее всего понадобятся и другие права
        Object.assign(this.dashboardPermissions, res.data);
      }
    });

    this.store.pipe(takeUntil(this._destroy$), select('dashboardUpdate')).subscribe((res) => {
      if (res.data) {
        this.store.dispatch(DashboardDetailGet({ id: this.dashboardId, q: {} }));
        this.store.dispatch(DashboardDetailChartGet({ id: this.dashboardId }));
      }
    });

    this.store.pipe(takeUntil(this._destroy$), select('dashboardCommentsAll')).subscribe((res) => {
      if (res.data) {
        this.dashboardCommentsObject = res.data.result[0];
        this.chartsCommentsForId = {};

        // Следит за актуальностью счетчика комментариев при добавлении и удалении.
        Object.keys(this.dashboardCommentsObject).forEach((id) => {
          this.chartsCommentsForId[id] = this.dashboardCommentsObject[id] > 0;
        });
      }
    });

    this.store.pipe(takeUntil(this._destroy$), select('chartDetailDataGetCSV')).subscribe((res) => {
      // в res.data blob файла содержится
      if (res.data) {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(res.data);
        a.href = objectUrl;
        a.download = `${res.chartName}.csv`;
        a.click();
        URL.revokeObjectURL(objectUrl);
      }
    });

    this.store
      .pipe(takeUntil(this._destroy$), select(selectDashboardCompleteDetailState))
      .subscribe((res) => {
        // console.log(!res.loading, res.data, 'LOADING!');
        if (res.data && !res.loading) {
          if (res.data.result?.position_json) {
            this.cssGrid = JSON.parse(res.data.result?.position_json);
          }

          // костыль, чтобы отделять старые дашборды от новых
          if (
            (this.cssGrid &&
              Object.keys(this.cssGrid).length === 0 &&
              Object.getPrototypeOf(this.cssGrid) === Object.prototype) ||
            this.cssGrid?.type
          ) {
            this.dashboardType = 'new';
          }

          this.dashboardInfo = res.data;
          this.isPublished = this.dashboardInfo?.result.published;
          this.dashboardChartsAmount = res.data.chartsData.result.length;

          if (this.dashboardInfo.result.json_metadata && this.firstRoutingCheck) {
            let jsonMetadata = JSON.parse(this.dashboardInfo.result.json_metadata);
            this.filters.list = jsonMetadata?.native_filter_configuration;

            if (this.filters.list?.length) {
              const defaultIndex = this.filters.list.findIndex((element) => {
                return element.default;
              });
              this.filters.time = this.filters.list[defaultIndex]?.data;
            }
            this.firstRoutingCheck--;
          }

          res.data.chartsData.result.forEach((element: any) => {
            const newElement = Object.assign({}, element.form_data);

            if (this.filters.time) {
              newElement.time_range = this.filters.time;
            }
            if (newElement.metric) {
              newElement.metrics = [newElement.metric];
              // delete newElement.metric;
            }

            if (newElement.secondary_metric) {
              newElement.metrics.push(newElement.secondary_metric);
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
            // this.store.dispatch(ChartDetailDataPost({
            //   form_data: {
            //     slice_id: newElement.slice_id
            //   },
            //   body: body
            // }));
          });
          // console.log(Object.keys(this.chartsDatasComplete).length, res.data.chartsData.result.length)
          // if (Object.keys(this.chartsDatasComplete).length === res.data.chartsData.result.length) {
          //   this.loading = res.loading;
          // }

          this.addComponentsFromTabs(this.cssGrid);

          if (this.dashboardType === 'new') {
            this.selectChartIdNew();
          } else {
            this.selectChartId();
          }
        }
      });

    this.store.pipe(takeUntil(this._destroy$), select('chartDetailData')).subscribe((res) => {
      if (res.data) {
        const chartDataComplete = {
          chartName: res.chartData.sliceName,
          chartType: res.chartData.sliceType,
          data: res.data.result[0],
        };

        this.chartsDatasComplete[res.chartData.sliceId] = chartDataComplete;

        // this.dashboardChartsGraph.push( this.configGraph(chartDataComplete, res.chartData.sliceName));
        this.dashboardChartsObject[res.chartData.sliceId] = {
          chartName: res.chartData.sliceName,
          chartType: this.chartTypeDict[res.chartData.sliceType],
          chartSubheader: res.chartData.sliceSubheader,
          // graph: this.configGraph(chartDataComplete, res.chartData.sliceName)
          graph: this.chartOptionService.configChart(chartDataComplete),
        };

        if (Object.keys(this.chartsDatasComplete).length === this.dashboardChartsAmount) {
          this.loading = false;
        }

        if (this.dashboardType === 'new') {
          this.selectChartIdNew();
        } else {
          this.selectChartId();
        }

        this.markEmailSubsCharts();
        this.toggleShowCommentsIcons();
      }
    });
  }

  private toggleShowCommentsIcons(): void {
    Object.keys(this.chartsDatasComplete).forEach((chartId) => {
      this.store.dispatch(
        DashboardChartCommentsGet({
          dashboardId: this.dashboardId,
          chartId,
          callback: (data) => {
            this.chartsCommentsForId[chartId] = data.result.length > 0;
          },
        })
      );
    });
  }

  addComponentsFromTabs(elements: any): void {
    elements.position?.forEach((element: any, elementIndex: number): void => {
      if (element.component && element.meta?.tabs?.length > 0) {
        element.meta.tabs.forEach((tab: any, tabIndex: number): void => {
          tab.items?.forEach((item: any, itemIndex: number): void => {
            item.elementTabItemIndex = `${elementIndex}:${tabIndex}:${itemIndex}`;

            this.chartsDatasCompleteForTabs[item.content.chartId] = {
              chartName: item.content.chartName,
              chartType: item.content.chartType,
              data: {
                data: item.content.graph?.series ? item.content.graph?.series[0]?.data : null,
              },
              // graph: this.chartOptionService.configChart(chartDataComplete),
              graph: item.content.graph,
            };
          });
        });
      }
    });
  }

  addChartInfo(chart: any, body: any) {
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

  isEmptyObject(obj: any) {
    return obj && Object.keys(obj).length === 0;
  }

  isNegativeNumber(number: number) {
    return Math.sign(number);
  }

  onChartInit(event: any, chartId: number) {
    this.chartsDom[chartId] = event;
  }

  onChartEvent(event: any, type: string, chartId: number) {
    const zoomSize = 6;
    if (type === 'chartClick') {
      // if (event.componentSubType === 'pie') {
      //   this.router.navigate(['/main/dashboard/3']);
      // }

      this.chartsDom[chartId].dispatchAction({
        type: 'dataZoom',
        startValue: Math.max(event.dataIndex - zoomSize / 2),
        endValue: Math.min(event.dataIndex + zoomSize / 2, 30),
      });
    } else if (type === 'chartDblClick') {
      this.chartsDom[chartId].dispatchAction({
        type: 'dataZoom',
        startValue: 0,
        endValue: 30,
      });
    }
  }

  exportPDFAll(name: string = 'dashboard') {
    this.setShowCommentsIcons(false);

    // next tick
    setTimeout(() => {
      const tabData = document.getElementsByClassName('mat-tab-label') as any as Array<HTMLElement>;
      const pdf = new jsPDF({
        unit: 'mm',
        orientation: 'landscape',
      });
      const matTabData = document.querySelectorAll(
        '*[id^="mat-tab-content-"]'
      ) as any as Array<HTMLElement>;

      // setTimeout'ы это необходимое зло, но приму предложения, как дожидаться загрузки данных DOM после клика на новую вкладку
      if (Array.from(matTabData).length) {
        Array.from(matTabData).forEach(async (element, index) => {
          setTimeout(async () => {
            Array.from(tabData)[index].click();

            setTimeout(async () => {
              const data = document.getElementById('dashboardContainer');
              const canvas = await html2canvas(data);

              const contentDataURL = canvas.toDataURL('image/png');
              const imgProps = pdf.getImageProperties(contentDataURL);
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
              const position = 0;

              pdf.addImage(contentDataURL, 'PNG', 0, position, pdfWidth, pdfHeight);
              pdf.addPage();
            }, 200);
          }, index * 1000);
        });

        setTimeout(() => {
          pdf.deletePage(Array.from(tabData).length + 1);
          pdf.save(name);
        }, Array.from(tabData).length * 1000 + 200);
      } else {
        const data = document.getElementById('dashboardContainer');

        html2canvas(data).then((canvas) => {
          const contentDataURL = canvas.toDataURL('image/png');

          if (canvas.height > canvas.width) {
            // меняем ориентацию страницы в зависимости от размера дашборда
            const pdf = new jsPDF({
              unit: 'mm',
              orientation: 'portrait',
            });

            const imgProps = pdf.getImageProperties(contentDataURL);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            const position = 0;

            pdf.addImage(contentDataURL, 'PNG', 0, position, pdfWidth, pdfHeight);
            pdf.save(name); // Generated PDF
          } else {
            const pdf = new jsPDF({
              unit: 'mm',
              orientation: 'landscape',
            });

            const imgProps = pdf.getImageProperties(contentDataURL);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            const position = 0;

            pdf.addImage(contentDataURL, 'PNG', 0, position, pdfWidth, pdfHeight);
            pdf.save(name); // Generated PDF
          }
        });
      }
    });
    // doc.save(name);
  }

  private setShowCommentsIcons(flag: boolean): void {
    Object.keys(this.chartsCommentsForId).forEach((key) => {
      this.chartsCommentsForId[key] = flag;
    });
  }

  // todo ошибка в - 949 Стак и план Контракт от рода войск - а в табах работает
  exportPDF(chartId: number, name: string) {
    const doc = new jsPDF({
      unit: 'px',
      orientation: 'landscape',
    });

    doc.addFont(
      '../../../../../assets/fonts/source-sans-pro/SourceSansPro-Regular.ttf',
      'Source_Sans_Pro',
      'normal'
    );
    doc.setFont('Source_Sans_Pro');
    doc.text(name, 20, 20);

    const chartTypes = ['big_number_total', 'big_number', 'sunburst'];

    if (chartTypes.includes(this.chartTypeDict[this.chartsDatasComplete[chartId]?.chartType])) {
      const bigNumberDiv = document.getElementById(`chart-${chartId}`) as HTMLElement;

      html2canvas(bigNumberDiv, { scale: 3 }).then((canvas) => {
        const contentDataURL = canvas.toDataURL('image/png');
        doc.addImage(
          contentDataURL,
          'PNG',
          10,
          30,
          bigNumberDiv.offsetWidth,
          bigNumberDiv.offsetHeight
        );
      });
    } else {
      let chart;

      if (this.chartsDom[chartId]) {
        chart = this.chartsDom[chartId];
      } else if (this.chartsDatasComplete[chartId]) {
        chart = this.chartsDatasComplete[chartId];
      } else if (this.chartsDatasCompleteForTabs[chartId]) {
        chart = this.chartsDatasCompleteForTabs[chartId];
      } else {
        console.log(`exportPDF / Графика chartId=${chartId} нет в объектах данных!`);

        return;
      }

      if (chart && chart.getDataURL) {
        const imageData = chart.getDataURL({
          pixelRatio: 2,
          backgroundColor: '#fff',
        });
        // debugger
        // считаем ширину и высоту, чтобы поместиться в а4
        let newImageWidth = chart?.getWidth();
        let newImageHeight = chart?.getHeight();
        if (chart?.getWidth() > doc.internal.pageSize.getWidth()) {
          newImageWidth = doc.internal.pageSize.getWidth();
          newImageHeight = Math.round(
            (doc.internal.pageSize.getWidth() / chart.getWidth()) * chart.getHeight()
          );
        }

        // минус 40 потому что часть места может занимать заголовок графика, а мы прирваниваем высоту к высоте документа
        if (chart?.getHeight() > doc.internal.pageSize.getHeight()) {
          newImageHeight = doc.internal.pageSize.getHeight() - 40;
          newImageWidth = Math.round(
            ((doc.internal.pageSize.getHeight() - 40) / chart.getHeight()) * chart.getWidth()
          );
        }

        doc.addImage(imageData, 'JPEG', 10, 30, newImageWidth, newImageHeight);
      } else {
        console.error('exportPDF / Выбранного графика нет в chartsDom!');
      }
    }
    setTimeout(() => {
      doc.save(name);
    }, 200);
  }

  private selectChartId(): void {
    /* @ts-ignore */
    const chartId = Number(window.dashboardIdChartId);

    if (chartId) {
      const chart = Object.values(this.cssGrid).filter(
        (elem: any) => elem.meta?.chartId === chartId
      );

      if (chart) {
        /* @ts-ignore */
        window.dashboardIdChartId = undefined;

        /* @ts-ignore */
        const targetChart = document.getElementById(chart[0]?.id);

        if (targetChart) {
          this.targetChartSelected(targetChart);
        }
      }
    }
  }

  // Не учитывает когда добавлены одинаковые графики.
  private selectChartIdNew(): void {
    /* @ts-ignore */
    const chartId = Number(window.dashboardIdChartId);

    if (chartId) {
      setTimeout(() => {
        // Поиск графика в видимой части.
        const targetChart: HTMLElement = document.getElementById(`chart-${chartId}`);
        /* @ts-ignore */
        window.dashboardIdChartId = undefined;

        if (targetChart) {
          this.targetChartSelected(targetChart);
        } else {
          // Поиск графика в скрытых (со второго) табах.
          const chartInTab = this.chartsDatasCompleteForTabs[chartId];

          if (chartInTab) {
            // При необходимости заменить во всех ниже forEach на for:break
            //  для оптимизации производительности.
            this.cssGrid.position.forEach((el: any) => {
              if (el.meta?.type === 'tabs') {
                el.meta.tabs.forEach((tab) => {
                  tab.items.forEach((item) => {
                    if (item.content.chartId === chartId) {
                      const [elementIndex, tabIndex, itemIndex] =
                        item.elementTabItemIndex.split(':');

                      el.meta.selected = tabIndex;

                      setTimeout(() => {
                        const selector = `mat-tab-label-${elementIndex}-${tabIndex}`;
                        const targetTab: HTMLElement = document.getElementById(selector);

                        if (targetTab) {
                          targetTab.click();

                          setTimeout(() => {
                            const chart: HTMLElement = document.getElementById(`chart-${chartId}`);

                            if (chart) {
                              this.targetChartSelected(chart);
                            }
                          });
                        }
                      });
                    }
                  });
                });
              }
            });
          }
        }
      });
    }
  }

  private targetChartSelected(targetChart: HTMLElement): void {
    targetChart.scrollIntoView();
    targetChart.classList.add('selected');

    setTimeout(() => {
      targetChart.classList.remove('selected');
    }, 10000);
  }

  private async markEmailSubsCharts(): Promise<any> {
    try {
      // todo username -> userId - теперь id есть в localstorage - потребует изменений на node бэке
      const userSubId = localStorage.getItem('username'); // /${userSubId}

      const response = await fetch(`${environment.APIForSendingEmails}/users/${userSubId}`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: { 'Content-Type': 'application/json' },
      });

      const usersSubs = await response.json();
      const id = location.pathname.match(/^\/main\/dashboard\/(\d+)$/);

      if (id && id[1] && Object.keys(usersSubs).length > 0) {
        const dashboardId = id[1];
        const probablySubCharts = Object.values(usersSubs).filter(
          (userSub: any) => userSub.dashboardId === dashboardId
        );

        Object.values(this.cssGrid)
          .filter(({ type }) => type === 'CHART')
          .forEach((chart: any) => {
            probablySubCharts.forEach((subChart: any) => {
              chart.meta.isMailSubHasBeenIssued =
                Number(dashboardId) === Number(subChart.dashboardId) &&
                Number(chart.meta.chartId) === Number(subChart.chartId);
            });
          });
      }
    } catch (err) {
      console.error('markEmailSubsCharts', err);
    }
  }

  public toggleOpenFilters(): void {
    this.isFiltersShowed = !this.isFiltersShowed;
  }

  public expandChartClick(cssGridItem: any, chartItem: any, item: any) {
    this.expandChart = true;
    this.expandChartClickFn(cssGridItem, chartItem, item);
  }

  public expandChartClickNew(cssGridItem: any, chartItem: any, item: any) {
    if (!cssGridItem.meta) {
      cssGridItem.meta = { chartId: item };
    }

    this.expandChartNew = true;
    this.expandChartClickFn(cssGridItem, chartItem, item);
  }

  private expandChartClickFn(cssGridItem: any, chartItem: any, item: any): void {
    if (!cssGridItem.meta) {
      cssGridItem.meta = { chartId: cssGridItem.id };
    }

    this.expandCssGrid = cssGridItem;
    this.expandChartObject = chartItem;
    this.expandItem = item;
    // window.scrollTo(0, 0);
    // document.body.classList.add('stop-scrolling');
  }

  closeExpand() {
    this.expandChart = false;
    this.closeExpandFn();
  }

  closeExpandNew() {
    this.expandChartNew = false;
    this.closeExpandFn();
  }

  private closeExpandFn(): void {
    this.expandCssGrid = {};
    this.expandChartObject = {};
    this.expandItem = '';
    document.body.classList.remove('stop-scrolling');
  }

  calcWidth(width: number, gridParent: any) {
    if (gridParent.type === 'COLUMN') {
      return (gridParent.meta.width / 12) * this.dashboardMaxWidth;
    } else {
      return (width / 12) * this.dashboardMaxWidth;
    }
  }

  calcNewWidth(width: number) {
    return (this.dashboardMaxWidth / 12) * width;
  }

  onCopyLinkDashboardId(dashboardIdStr: string): void {
    const dashboardId = Number(dashboardIdStr);

    if (Number.isInteger(dashboardId)) {
      const uri = `${location.origin}?c=${dashboardId}`;
      navigator.clipboard.writeText(uri);

      this._snackBar.openFromComponent(CopyLinkDashboardComponent, {
        duration: this.notifyDurationInSeconds * 1000,
      });
    } else {
      this._snackBar.openFromComponent(CopyLinkDashboardErrorComponent, {
        duration: this.notifyDurationInSeconds * 1000,
      });
    }
  }

  onCopyLinkChart(item: string): void {
    if (this.cssGrid[item].meta?.chartId) {
      const uri = this.getLinkChart(item);
      navigator.clipboard.writeText(uri);

      this._snackBar.openFromComponent(CopyLinkChartComponent, {
        duration: this.notifyDurationInSeconds * 1000,
      });
    } else {
      this._snackBar.openFromComponent(CopyLinkChartErrorComponent, {
        duration: this.notifyDurationInSeconds * 1000,
      });
    }
  }

  onCopyLinkChartNew(chartId: number): void {
    if (chartId) {
      const uri = this.getLinkChartNew(chartId);
      navigator.clipboard.writeText(uri);

      this._snackBar.openFromComponent(CopyLinkChartComponent, {
        duration: this.notifyDurationInSeconds * 1000,
      });
    } else {
      this._snackBar.openFromComponent(CopyLinkChartErrorComponent, {
        duration: this.notifyDurationInSeconds * 1000,
      });
    }
  }

  getLinkChart(item: string): string {
    const id = location.pathname.match(/^\/main\/dashboard\/(\d+)$/);

    if (id && id[1]) {
      return `${location.origin}?c=${id[1]}:${this.cssGrid[item].meta.chartId}`;
    }

    return location.origin;
  }

  getLinkChartNew(chartId: number): string {
    const id = location.pathname.match(/^\/main\/dashboard\/(\d+)$/);

    if (id && id[1]) {
      return `${location.origin}?c=${id[1]}:${chartId}`;
    }

    return location.origin;
  }

  onOpenDialogSendDashboardToEmail(dashboardId: string): void {
    if (dashboardId) {
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
          await this.onSendLinkDashboardToEmail(dashboardId, e.data);
        }
      });
    }
  }

  onOpenDialogSendToEmail(item: string): void {
    const dialogRef = this.dialog.open(DashboardDetailDialogComponent, {
      data: {
        title: 'Отправить график через e-mail',
        isBlockSub: this.cssGrid[item].meta.isMailSubHasBeenIssued,
        isEmailSub: false,
        frequency: -1,
        emails: [{ value: '' }],
      },
    });

    dialogRef.afterClosed().subscribe(async (e: any) => {
      if (e?.type === 'confirm') {
        await this.onSendLinkToEmail(item, e.data);
      }
    });
  }

  onOpenDialogSendToEmailNew(chartId: string, item?: any): void {
    const dialogRef = this.dialog.open(DashboardDetailDialogComponent, {
      data: {
        title: 'Отправить график через e-mail',
        isBlockSub: false,
        isEmailSub: false,
        frequency: -1,
        emails: [{ value: '' }],
      },
    });

    dialogRef.afterClosed().subscribe(async (e: any) => {
      if (e?.type === 'confirm') {
        await this.onSendLinkToEmailNew(chartId, e.data, item);
      }
    });
  }

  async onSendLinkToEmail(item: string, data: any): Promise<void> {
    const { text } = this.cssGrid.HEADER_ID.meta;
    const { sliceNameOverride } = this.cssGrid[item].meta;
    const title = `${text} - ${sliceNameOverride}`;

    const id = location.pathname.match(/^\/main\/dashboard\/(\d+)$/);

    if (id && id[1]) {
      const dashboardId = id[1];
      const { chartId }: { chartId: string } = this.cssGrid[item].meta;
      const href = `${location.origin}?c=${dashboardId}:${chartId}`;
      const html = `<a href="${href}" target="_blank">Ссылка на график</a>`;

      await this.sendLinkToEmailFn({ data, item, title, html, dashboardId, chartId });
    }
  }

  private async sendLinkToEmailFn({
    data,
    title,
    html,
    dashboardId,
    chartId,
    item,
  }: {
    data: any;
    title: string;
    html: string;
    dashboardId: string;
    chartId: string;
    item?: any;
  }): Promise<void> {
    const formData = new FormData();
    formData.append('username', localStorage.getItem('username'));
    formData.append('emails', JSON.stringify(data.emails));
    formData.append('frequency', data.frequency > -1 ? data.frequency : 1);
    formData.append('title', title);
    formData.append('html', html);

    if (data.isEmailSub) {
      formData.append('isEmailSub', data.isEmailSub);
      formData.append('dashboardId', String(dashboardId));

      if (chartId) {
        formData.append('chartId', chartId);
      }
    }

    try {
      await this.postData(formData);

      this._snackBar.openFromComponent(EmailSendedComponent, {
        duration: this.notifyDurationInSeconds * 1000,
      });

      if (item && this.cssGrid[item]) {
        this.cssGrid[item].meta.isMailSubHasBeenIssued = true;
      }
    } catch (err) {
      console.log('Не удалось отправить письмо', err);

      this._snackBar.openFromComponent(EmailSendedErrorComponent, {
        duration: this.notifyDurationInSeconds * 1000,
      });
    }
  }

  async onSendLinkToEmailNew(chartId: string, data: any, item?: any): Promise<void> {
    const dashboardTitle = this.dashboardInfo.result.dashboard_title;
    const chartName = this.dashboardChartsObject[chartId]?.chartName || item?.content.chartName;
    const title = `${dashboardTitle} - ${chartName}`;

    const id = location.pathname.match(/^\/main\/dashboard\/(\d+)$/);

    if (id && id[1]) {
      const dashboardId = id[1];
      const href = `${location.origin}?c=${dashboardId}:${chartId}`;
      const html = `<a href="${href}" target="_blank">Ссылка на график</a>`;

      await this.sendLinkToEmailFn({ data, item, title, html, dashboardId, chartId });
    }
  }

  async onSendLinkDashboardToEmail(dashboardId: string, data: any): Promise<void> {
    const title = this.cssGrid.HEADER_ID?.meta.text || this.dashboardInfo.result.dashboard_title;
    const href = `${location.origin}?c=${dashboardId}`;
    const html = `<a href="${href}" target="_blank">Ссылка на график</a>`;

    await this.sendLinkToEmailFn({
      data,
      title,
      html,
      dashboardId,
      chartId: undefined,
      item: undefined,
    });
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

  onExportCSV(chartId: number, item: string): void {
    // const saveToFileData = this.exportCsvService.onExportCSV(
    //   chartId,
    //   item,
    //   this.chartsDatasComplete
    // );

    // if (saveToFileData) {
    //   this.saveToCSVFile(saveToFileData[0], saveToFileData[1], saveToFileData[2]);
    // }
    this.store.dispatch(
      ChartDetailDataGetCSV({
        id: chartId.toString(),
        name: item,
      })
    );
  }

  onExportCSVNew(chartId: number, chartName: string): void {
    // const saveToFileData = this.exportCsvService.onExportCSV(
    //   chartId,
    //   chartName,
    //   this.chartsDatasComplete,
    //   this.chartsDatasCompleteForTabs
    // );

    // if (saveToFileData && !saveToFileData[1].name) {
    //   saveToFileData[1] = { name: saveToFileData[1] };
    // }

    // if (saveToFileData) {
    //   this.saveToCSVFileNew(saveToFileData[0], saveToFileData[1], saveToFileData[2]);
    // }
    this.store.dispatch(
      ChartDetailDataGetCSV({
        id: chartId.toString(),
        name: chartName,
      })
    );
  }

  onExportCSVForTabs(chartId: number, chartName: string): void {
    const saveToFileData = this.exportCsvService.onExportCSV(
      chartId,
      chartName,
      this.chartsDatasCompleteForTabs
    );

    if (saveToFileData) {
      this.saveToCSVFileNew(saveToFileData[0], { name: chartName }, saveToFileData[2]);
    }
  }

  saveToCSVFile(csvTitle: string, item: string, result: Array<Array<string | number>>): void {
    const $link = this.getElementForSaveToCSVFile(csvTitle, result);
    $link.download = `${this.cssGrid[item].meta.sliceNameOverride}.csv`;
    $link.click();
  }

  saveToCSVFileNew(csvTitle: string, element: any, result: Array<Array<string | number>>): void {
    const $link = this.getElementForSaveToCSVFile(csvTitle, result);

    $link.download = `${
      element.name ||
      element.content?.chartName ||
      this.dashboardChartsObject[element.id]?.chartName
    }.csv`;

    $link.click();
  }

  private getElementForSaveToCSVFile(
    csvTitle: string,
    result: Array<Array<string | number>>
  ): HTMLAnchorElement {
    result.forEach((row: []): void => {
      csvTitle += row.join(',');
      csvTitle += '\n';
    });

    const $link = document.createElement('a');
    const universalBOM = '\uFEFF';
    $link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(universalBOM + csvTitle);
    $link.target = '_blank';

    return $link;
  }

  // сюда приходит фильтр, который будет использоваться, а также полный список фильтров.
  processFilter(event) {
    // if (event.timerange) {
    this.filters['time'] = event.timerange ? event.timerange : '';
    this.filters.list = event.filters;
    // }

    this.store.dispatch(
      DashboardDetailUpdate({
        id: this.dashboardId,
        payload: {
          json_metadata: JSON.stringify({ native_filter_configuration: event.filters }),
        },
      })
    );
  }

  onEditClick() {
    clearInterval(this.autoRefreshTimer);
    this.router.navigate([`/main/dashboard/edit/${this.dashboardId}/`]);
  }

  setFavoriteStatus() {
    this.store.dispatch(
      DashboardSetFavoriteStatus({
        payload: {
          data: [Number(this.dashboardId)],
          select: !this.favoriteStatus,
          callback: () => {
            this.store.dispatch(
              DashboardDetailFavoriteStatusListGet({
                payload: { ids: [Number(this.dashboardId)] },
              })
            );
          },
        },
      })
    );

    this.store.dispatch(
      DashboardPin({
        payload: {
          id: Number(this.dashboardId),
          isPin: false,
        },
      })
    );
  }

  publishDashboard() {
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

  // todo если добавлено несколько одинаковых графика, то у всех графиков с одинаковым id открываются всплывающие окна.
  openCommentPopup(id) {
    if (this.openCommentIndex === id) {
      this.openCommentIndex = -1;
    } else {
      this.openCommentIndex = id;
    }
  }

  public onCommentStateChange(): void {
    this.store.dispatch(DashboardCommentsGet({ dashboardId: this.dashboardId }));
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();

    this.store.dispatch(ChartClear());
    this.store.dispatch(DashboardClear());
    clearInterval(this.autoRefreshTimer);
  }
}
