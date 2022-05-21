import { Component, ElementRef, OnInit, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import * as appState from '@store/reducers/index';
import { Router } from '@angular/router';
import {
  IDashboardDatasource,
  TDashboardColumnName,
} from '@page/content/dashboards/dashboards.interface';
import { DashboardListGet } from '@store/actions/dashboard/dashboard.actions';
import { takeUntil } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CurrentUserGet } from '@store/actions/user/user.actions';
import moment from 'moment';
import { IDashboard } from '@models/dashboard/dashboard.model';
import {
  DashboardDelete,
  DashboardExport,
  DashboardsOrder,
  DashboardsOrdersGet,
  DashboardGetPins,
  DashboardGetInfo,
  DashboardSetFavoriteStatus,
  DashboardDetailGet,
  DashboardPin,
} from '@app/store/actions/dashboard/dashboard.actions';
import { DialogService } from '@core/services/dialog.service';
import { DatasetListGet } from '@store/actions/dataset/dataset.actions';
import { IDatasetData } from '../dataset/dataset.component';
import { PopupWarningComponent } from '@shared/components/popups/popup-warning/popup-warning.component';
import { DisplayGrid, GridType } from 'angular-gridster2';
import debounce from 'debounce';
import clonedeep from 'lodash.clonedeep';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
})
export class StartPageComponent implements OnInit {
  private _destroy$ = new Subject<null>();
  public dashboardMaxWidth: number = window.innerWidth - 60;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.dashboardMaxWidth = event.target.innerWidth - 60;
  }

  private gridsterScrollHeightDefault = '100%';
  public gridsterScrollHeight = this.gridsterScrollHeightDefault;

  public searchFormControl: FormControl;

  public userName = '';
  public permissions = {
    canRead: false,
    canWrite: false,
  };

  private mobileBreakpoint = 640;
  public gridsterOptions = {
    displayGrid: DisplayGrid.OnDragAndResize,
    gridType: GridType.VerticalFixed,
    fixedRowHeight: 340,
    margin: 20,
    outerMargin: false,
    minCols: 2,
    maxCols: 2,
    minRows: 1,
    maxRows: 3,
    mobileBreakpoint: this.mobileBreakpoint,
    resizable: { enabled: false },
    disableScrollHorizontal: true,
    itemResizeCallback: debounce(this.gridsterResize.bind(this), 1000 / 60),
    draggable: {
      enabled: true,
      start: (dashboard, gridsterItem, eventStart) => {
        const safeClick = (event): boolean => {
          return (
            event.target.closest('.dashboard-table-actions-button') ||
            event.target.closest('.favorite-button')
          );
        };

        if (safeClick(eventStart)) {
          return;
        }

        const $appContent = document.querySelector('app-content');
        this.toggleNotSelectedGridsterItemMakeTransparent(eventStart, true);

        const threshold = 30;
        let pixelsMovement = 0;

        const mouseup = (eventEnd) => {
          $appContent.removeEventListener('mousemove', mousemove);
          $appContent.removeEventListener('mouseup', mouseup);

          if (safeClick(eventEnd)) {
            return;
          }

          if (pixelsMovement > threshold) {
            this.toggleNotSelectedGridsterItemMakeTransparent(eventEnd, false);

            setTimeout(() => {
              const protectOrderFromLastViewed = (d) => {
                const coords = {
                  x: d.x ?? -1,
                  y: d.y ?? -1,
                };

                return `${coords.x}:${coords.y}`;
              };

              this.store.dispatch(
                DashboardsOrder({
                  payload: {
                    orders: this.pinnedAndLastViewedDashboards.map((d) => ({
                      id: d.id,
                      order: protectOrderFromLastViewed(d),
                    })),
                  },
                })
              );
            });
          } else {
            setTimeout(() => this.redirectToDashboard(dashboard));
          }
        };

        const mousemove = (eventMove) => {
          pixelsMovement += Math.abs(eventMove.movementX) + Math.abs(eventMove.movementY);
        };

        $appContent.addEventListener('mousemove', mousemove);
        $appContent.addEventListener('mouseup', mouseup);
      },
    },
  };

  // -- DASHBOARDS = forDF
  public dashboardsFavoritesTable; // new MatTableDataSource()
  public sortOrderForDF: 'asc' | 'desc' = 'desc';
  public sortColumnForDF: TDashboardColumnName = 'changed_on_delta_humanized';

  public displayedColumnsForDF: string[] = [
    'dashboard_title',
    'published',
    'changed_on_delta_humanized',
    'changed_by',
  ];
  private filtersOptionsForDF: { [key: string]: { operation: string; column: string } } = {
    dashboard_title: { operation: 'title_or_slug', column: 'dashboard_title' },
    published: { operation: 'eq', column: 'published' },
    favorite: { operation: 'dashboard_is_favorite', column: 'id' },
    changed_by: { operation: 'rel_o_m', column: 'changed_by.first_name' },
  };
  private filterStateForDF = {
    dashboard_title: undefined,
    published: undefined,
    favorite: true,
    changed_by: undefined,
  };

  public dashboardsFavoritesTableRawData = [];
  public isDashboardsLoaded = true;
  public dashboardPins: { [id: number]: { id: number; pin: boolean } } = {};

  public pinnedAndLastViewedDashboards = [];
  private dashboardsAndPinsForTableLoaded = { dashboards: false, pins: false };
  private pinnedDashboardsAndOrderForCardsLoaded = { pinnedDashboards: false, order: false };
  private dashboardsFavoritesCoords = [];

  // -- DATASETS = forDS
  public isDatasetTableShowed = true;

  public datasets; // new MatTableDataSource()
  public sortOrderForDS: 'asc' | 'desc' = 'desc';
  public sortColumnForDS: TDashboardColumnName = 'changed_on_delta_humanized';

  public displayedColumnsForDS: string[] = [
    'table_name',
    'kind',
    'schema',
    'changed_on_delta_humanized',
    'changed_by_name',
  ];
  private filtersOptionsForDS: { [key: string]: { operation: string; column: string } } = {
    table_name: { operation: 'ct', column: 'table_name' },
    // kind: { operation: 'dataset_is_null_or_empty', column: 'sql' },
    schema: { operation: 'eq', column: 'schema' },
    changed_on_delta_humanized: { operation: 'eq', column: 'changed_on_delta_humanized' },
    changed_by_name: { operation: 'eq', column: 'changed_by.first_name' },
  };
  private filterStateForDS = {
    table_name: { key: 'table_name', inputValue: '' },
    // kind: { key: 'kind', inputValue: 'Все' },
    schema: { key: 'schema', inputValue: 'Все' },
    changed_on_delta_humanized: { key: 'changed_on_delta_humanized', inputValue: '' },
    changed_by_name: { key: 'changed_by_name', inputValue: '' },
  };

  @ViewChild('downloadRef') private downloadRef: ElementRef<HTMLAnchorElement>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private store: Store<appState.State>,
    private dialog: MatDialog,
    private router: Router,
    private dialogService: DialogService
  ) {
    this.searchFormControl = new FormControl('');
  }

  ngOnInit(): void {
    this.getDashboardsFavoritesList();
    this.getDashboardsOrder();
    this.getDatasetList();

    this.store.dispatch(DashboardGetInfo({ payload: { keys: ['permissions'] } }));
    this.store.dispatch(CurrentUserGet());
    this.store.dispatch(DashboardGetPins());

    this.store.pipe(takeUntil(this._destroy$), select('dashboard')).subscribe((res) => {
      if (res.data?.result?.length > 0 && this.isDashboardsLoaded) {
        this.dashboardsFavoritesTableRawData = clonedeep(res.data.result);

        this.dashboardsFavoritesTable = new MatTableDataSource(clonedeep(res.data.result));
        this.dashboardsFavoritesTable.sort = this.sort;

        this.dashboardsAndPinsForTableLoaded.dashboards = true;

        if (
          this.dashboardsAndPinsForTableLoaded.dashboards &&
          this.dashboardsAndPinsForTableLoaded.pins
        ) {
          this.dashboardsFavoritesTableSort();
          this.gridsterResize();
        }
      }

      this.isDashboardsLoaded = false;

      if (Array.isArray(res.info.permissions) && res.info.permissions.length) {
        const canRead = !!res.info.permissions.find((item) => item === 'can_read');
        const canWrite = !!res.info.permissions.find((item) => item === 'can_write');
        this.permissions = { canRead, canWrite };
      }
    });

    this.store
      .pipe(takeUntil(this._destroy$), select('dashboardExport'))
      .subscribe((data) => this.exportDataSubscriber(data));

    this.store
      .pipe(takeUntil(this._destroy$), select('datasetList'))
      .subscribe((res) => this.datasetListSubscribe(res));

    this.store
      .pipe(takeUntil(this._destroy$), select('startCurrentUser'))
      .subscribe((res: any): void => {
        if (res.data) {
          const { lastName, firstName } = res.data;
          this.userName = `${lastName} ${firstName}`;
        }
      });

    this.store.pipe(takeUntil(this._destroy$), select('dashboardPins')).subscribe((data) => {
      if (!data.data) {
        return;
      }

      const dashboardsRequest = [];

      data.data.result.forEach((pin) => {
        this.dashboardPins[pin.id] = pin;

        dashboardsRequest.push(
          new Promise((resolve) => {
            this.store.dispatch(
              DashboardDetailGet({
                id: pin.id,
                q: {},
                callback: resolve,
              })
            );
          })
        );
      });

      this.dashboardsAndPinsForTableLoaded.pins = true;

      if (
        this.dashboardsAndPinsForTableLoaded.dashboards &&
        this.dashboardsAndPinsForTableLoaded.pins
      ) {
        this.dashboardsFavoritesTableSort();
      }

      this.getPinsDashboardsList(dashboardsRequest);
    });
  }

  private getPinsDashboardsList(dashboardsRequest): void {
    Promise.all(dashboardsRequest).then((data) => {
      const pinnedAndLastViewedDashboards = [];

      data.forEach(({ result }) => {
        pinnedAndLastViewedDashboards.push(
          clonedeep({
            ...result,
            favorite: true,
            changed_on: moment(result.changed_on_utc).format('DD.MM.YY HH:mm'),
          })
        );
      });

      this.pinnedAndLastViewedDashboards = pinnedAndLastViewedDashboards;
      this.pinnedDashboardsAndOrderForCardsLoaded.pinnedDashboards = true;

      if (
        this.pinnedDashboardsAndOrderForCardsLoaded.pinnedDashboards &&
        this.pinnedDashboardsAndOrderForCardsLoaded.order
      ) {
        this.pinsDashboardsAndOrderLoaded();
      }
    });
  }

  private getDashboardsFavoritesList(): void {
    this.isDashboardsLoaded = false;

    this.store.dispatch(
      DashboardListGet({
        payload: {
          filters: this.getFiltersForDF(),
          order_column: this.sortColumnForDF,
          order_direction: this.sortOrderForDF,
          page_size: 10,
          callback: () => {
            this.isDashboardsLoaded = true;
          },
        },
      })
    );
  }

  private dashboardsFavoritesTableSort(): void {
    const dashboardsPinnedOnTop = [];

    Object.keys(this.dashboardPins).forEach((pinId) => {
      const dashboardPinnedIndex = this.dashboardsFavoritesTableRawData.findIndex(
        ({ id }) => id === Number(pinId) && this.dashboardPins[pinId].pin
      );

      if (dashboardPinnedIndex > -1) {
        const dashboardPinned = this.dashboardsFavoritesTableRawData[dashboardPinnedIndex];
        dashboardsPinnedOnTop.push(dashboardPinned);
        this.dashboardsFavoritesTableRawData.splice(dashboardPinnedIndex, 1);
      }
    });

    this.dashboardsFavoritesTableRawData = dashboardsPinnedOnTop.concat(
      this.dashboardsFavoritesTableRawData
    );

    this.dashboardsFavoritesTable = new MatTableDataSource(this.dashboardsFavoritesTableRawData);
    this.dashboardsFavoritesTable.sort = this.sort;
  }

  private getDashboardsOrder(): void {
    this.store.dispatch(
      DashboardsOrdersGet({
        payload: {
          callback: (data) => {
            this.dashboardsFavoritesCoords = data.orders.map(({ id, order }) => {
              const [x, y] = order.split(':');
              return { id, x: Number(x), y: Number(y) };
            });

            this.pinnedDashboardsAndOrderForCardsLoaded.order = true;

            if (
              this.pinnedDashboardsAndOrderForCardsLoaded.pinnedDashboards &&
              this.pinnedDashboardsAndOrderForCardsLoaded.order
            ) {
              this.pinsDashboardsAndOrderLoaded();
            }
          },
        },
      })
    );
  }

  private pinsDashboardsAndOrderLoaded(): void {
    const dashboardsNewOrder = [];

    this.pinnedAndLastViewedDashboards.forEach((favoriteDashboard) => {
      const dashboardWithCoord = this.dashboardsFavoritesCoords.find(
        (coord) => coord.id === favoriteDashboard.id
      );

      dashboardsNewOrder.push({
        ...favoriteDashboard,
        ...dashboardWithCoord,
        rows: 1,
        cols: 1,
      });
    });

    this.pinnedAndLastViewedDashboards = dashboardsNewOrder;
  }

  private getDatasetList(): void {
    this.store.dispatch(
      DatasetListGet({
        payload: {
          filters: this.getFiltersForDS(),
          order_column: this.sortColumnForDS,
          order_direction: this.sortOrderForDS,
          page_size: 10,
        },
      })
    );
  }

  public setFavoriteStatus(dashboard: IDashboardDatasource): void {
    this.store.dispatch(
      DashboardSetFavoriteStatus({
        payload: {
          data: [dashboard.id],
          select: false,
          callback: () => {
            this.getDashboardsFavoritesList();
          },
        },
      })
    );

    this.store.dispatch(
      DashboardPin({
        payload: {
          id: Number(dashboard.id),
          isPin: false,
        },
      })
    );
  }

  private toggleNotSelectedGridsterItemMakeTransparent(event, isMakeTransparent): void {
    const parentGridsterItem = event.target.closest('gridster-item');

    if (!parentGridsterItem) {
      return;
    }

    parentGridsterItem.style.zIndex = isMakeTransparent ? 1000 : '';
    const $gridsterItems = document.querySelectorAll('gridster-item');

    Array.from($gridsterItems).forEach(($item) => {
      if ($item.id !== parentGridsterItem.id) {
        /* @ts-ignore-nextline */
        $item.style.opacity = isMakeTransparent ? 0.5 : 1.0;
      }
    });
  }

  private gridsterResize(): void {
    this.gridsterScrollHeight = this.gridsterScrollHeightDefault;

    requestAnimationFrame(() => {
      const gridsterElement = document.querySelector('.gridster');

      if (gridsterElement) {
        this.gridsterScrollHeight = `${gridsterElement.scrollHeight}px`;
      }
    });
  }

  public exportDashboard(dashboard: IDashboardDatasource): void {
    this.store.dispatch(DashboardExport({ payload: [dashboard.id] }));
  }

  private exportDataSubscriber(data): void {
    if (!data.data) {
      return;
    }
    const refElem = this.downloadRef.nativeElement;
    const file = new Blob([JSON.stringify(data.data)], { type: 'text/plain' });
    refElem.href = URL.createObjectURL(file);
    refElem.download = `dashboard${data.data.id}.json`;
    refElem.click();
    this.dialogService.errorHandler(data);
  }

  public async confirmDeletion(dashboard: IDashboard[]): Promise<any> {
    const title = 'Удаление аналитической панели';
    const dTitle = dashboard[0].dashboard_title;
    const text = `Точно ли Вы хотите удалить аналитическую панель "${dTitle}"?`;

    this.dialog
      .open(PopupWarningComponent, {
        data: {
          title,
          text,
          btnSuccessTitle: 'Удалить',
          btnCancelTitle: 'Отмена',
        },
      })
      .afterClosed()
      .pipe(takeUntil(this._destroy$))
      .subscribe((isConfirm: boolean) => {
        if (isConfirm) {
          this.store.dispatch(
            DashboardDelete({
              payload: {
                id: dashboard[0].id,
                callback: () => {
                  this.getDashboardsFavoritesList();
                },
              },
            })
          );
        }
      });
  }

  public redirectToDashboardForMobile(dashboard: IDashboard) {
    const goTo = window.matchMedia(`(max-width: ${this.mobileBreakpoint}px)`);

    if (goTo.matches) {
      this.redirectToDashboard(dashboard);
    }
  }

  private redirectToDashboard(dashboard: IDashboard): void {
    if (this.permissions.canRead) {
      this.router.navigate(['/main/dashboard', dashboard.id]).then();
    }
  }

  private getFiltersForDF(): any[] {
    const filters = [];

    Object.keys(this.filterStateForDF).forEach((key) => {
      if (this.filterStateForDF[key]) {
        filters.push({
          col: this.filtersOptionsForDF[key].column,
          opr: this.filtersOptionsForDF[key].operation,
          value: this.filterStateForDF[key],
        });
      }
    });

    return filters;
  }

  private getFiltersForDS(): { opr: string; col: string; value: string }[] {
    const optionsModelFiltered = Object.values(this.filterStateForDS).filter(
      (option) =>
        (typeof option.inputValue === 'boolean' || option.inputValue.length > 0) &&
        option.inputValue !== '-1' &&
        option.inputValue !== 'Все'
    );

    const filters = [];

    optionsModelFiltered.forEach(({ key, inputValue }) => {
      const { operation, column } = this.filtersOptionsForDS[key];

      filters.push({
        opr: operation,
        col: column,
        value: inputValue,
      });
    });

    return filters;
  }

  private datasetListSubscribe(res): void {
    if (res.data) {
      this.datasets = new MatTableDataSource(res.data.result);
      this.datasets.sort = this.sort;
    }
  }

  public getSortListForDF(column: TDashboardColumnName): void {
    if (column === this.sortColumnForDF) {
      this.sortOrderForDF = this.sortOrderForDF === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumnForDF = column;
      this.sortOrderForDF = 'asc';
    }

    this.dashboardsAndPinsForTableLoaded.dashboards = false;
    this.isDashboardsLoaded = true;
    this.getDashboardsFavoritesList();
  }

  public getSortListForDS(column): void {
    if (column === this.sortColumnForDS) {
      this.sortOrderForDS = this.sortOrderForDS === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumnForDS = column;
      this.sortOrderForDS = 'desc';
    }

    this.getDatasetList();
  }

  public onSearchAll(search: HTMLInputElement): void {
    this.filterStateForDF.dashboard_title = search.value;
    this.filterStateForDS.table_name.inputValue = search.value;

    this.dashboardsAndPinsForTableLoaded.dashboards = false;
    this.getDashboardsFavoritesList();
    this.getDatasetList();
  }

  public async openDashboard(dashboard): Promise<void> {
    await this.router.navigate(['/main/dashboard', dashboard.id]).then();
  }

  public async openDataset(dataset: IDatasetData): Promise<void> {
    await this.router.navigate(['/main/dataset/detail', dataset.id]);
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
