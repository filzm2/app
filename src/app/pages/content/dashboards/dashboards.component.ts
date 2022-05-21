import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { select, Store } from '@ngrx/store';
import { RouterStateUrl } from '@app/store';
import { State as dashboardState } from '@store/reducers/dashboard/dashboard.reducer';
import * as appState from '@store/reducers/index';
import {
  DashboardDelete,
  DashboardExport,
  DashboardGetPins,
  DashboardPin,
  DashboardGetInfo,
  DashboardGetRelatedCreators,
  DashboardGetRelatedOwners,
  DashboardListGet,
  DashboardMultipleDelete,
  DashboardSetFavoriteStatus,
} from '@store/actions/dashboard/dashboard.actions';
import { pairwise, startWith, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import moment from 'moment';
import { IDashboard } from '@models/dashboard/dashboard.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  IDashboardDatasource,
  TDashboardColumnName,
  TViewMode,
} from '@page/content/dashboards/dashboards.interface';
import { ISelectItem } from '@store/reducers/dashboard/dashboard-related.reducer';
import * as rison from 'rison';
import * as fromRouter from '@ngrx/router-store';
import { DialogService } from '@core/services/dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupWarningComponent } from '@shared/components/popups/popup-warning/popup-warning.component';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardsComponent implements OnInit, OnDestroy {
  private _destroy$ = new Subject<null>();
  public paginator: any = {
    count: 0,
    pageSize: 24,
    currentPage: 0,
    skip: 0,
  };
  public permissions = {
    canRead: false,
    canWrite: false,
  };
  public isMobileFiltersShowed: boolean = false;
  public filterFormGroup: FormGroup;
  public searchFormControl: FormControl;
  public routerState: any;
  public dashboardList: IDashboardDatasource[];
  public displayedColumns: string[] = [
    'checkbox',
    'favorite',
    'dashboard_title',
    'published',
    'created_by',
    'last_modified',
    'changed_by',
    'owners',
    'actions',
  ];
  public viewMode: TViewMode = 'list';
  public owners: ISelectItem[] = [];
  public creators: ISelectItem[] = [];
  public sortColumn: TDashboardColumnName = 'changed_on_delta_humanized';
  public currentSelect: number[] = [];
  public sortOrder: 'asc' | 'desc' = 'desc';
  public allFavorite = false;
  private filtersOptions: { [key: string]: { operation: string; column: string } } = {
    owners: { operation: 'rel_m_m', column: 'owners' },
    created_by: { operation: 'rel_o_m', column: 'created_by' },
    published: { operation: 'eq', column: 'published' },
    favorite: { operation: 'dashboard_is_favorite', column: 'id' },
    dashboard_title: { operation: 'title_or_slug', column: 'dashboard_title' },
  };
  private filterState = {
    owners: null,
    created_by: null,
    published: null,
    favorite: null,
    dashboard_title: null,
  };
  public dashboardPins: { [id: number]: { id: number; pin: boolean } } = {};

  @ViewChild('downloadRef') private downloadRef: ElementRef<HTMLAnchorElement>;

  constructor(
    private store: Store<appState.State>,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private dialogService: DialogService
  ) {
    this.filterFormGroup = this.fb.group({
      owners: null,
      created_by: null,
      published_or_favorite: [],
    });
    this.searchFormControl = new FormControl('');
  }

  ngOnInit(): void {
    this.store
      .pipe(takeUntil(this._destroy$), select('router'), take(1))
      .subscribe((router) => this.initStateByUrl(router));

    this.store
      .pipe(takeUntil(this._destroy$), select('dashboard'))
      .subscribe((res) => this.initDashboardsList(res));

    this.store
      .pipe(takeUntil(this._destroy$), select('dashboardRelated'))
      .subscribe((data) => this.setRelatedData(data));

    this.store
      .pipe(takeUntil(this._destroy$), select('dashboardExport'))
      .subscribe((data) => this.exportDataSubscriber(data));

    this.store.pipe(takeUntil(this._destroy$), select('dashboardPins')).subscribe((data) => {
      if (!data.data) {
        return;
      }

      data.data.result.forEach((pin) => {
        delete this.dashboardPins[pin.id];

        if (pin.pin) {
          this.dashboardPins[pin.id] = pin;
        }
      });
    });

    this.getDashboardList();

    this.store.dispatch(DashboardGetPins());
    this.store.dispatch(DashboardGetRelatedOwners());
    this.store.dispatch(DashboardGetRelatedCreators());
    this.store.dispatch(DashboardGetInfo({ payload: { keys: ['permissions'] } }));

    this.filterFormGroup.valueChanges
      .pipe(takeUntil(this._destroy$), startWith(null), pairwise())
      .subscribe(([prev, current]) => {
        this.filterState.owners = current.owners;
        this.filterState.created_by = current.created_by;

        const pof = current.published_or_favorite;
        const favorite = pof?.find((val) => val === 'favorite');
        const published = pof?.find((val) => val === 'published');
        const draft = pof?.find((val) => val === 'draft');

        const prevDraft = prev?.published_or_favorite?.find((val) => val === 'draft');

        if (published && draft) {
          if (prevDraft) {
            this.filterFormGroup
              .get('published_or_favorite')
              .setValue(favorite ? [favorite, published] : [published]);
            return;
          }
          this.filterFormGroup
            .get('published_or_favorite')
            .setValue(favorite ? [favorite, draft] : [draft]);
          return;
        }

        this.filterState.favorite = favorite ? true : null;
        this.filterState.published = published ? true : draft ? false : null;
        this.paginator.currentPage = 0;
        this.currentSelect = [];

        this.getDashboardList();
      });
  }

  public onPageChange(evt: any): void {
    // this.skip = evt.skip;
    this.paginator.pageSize = evt.pageSize;
    this.paginator.currentPage = evt.pageIndex;
    this.paginator.skip = evt.skip;
    this.getDashboardList();
  }

  public onSearch(search: HTMLInputElement): void {
    this.filterState.dashboard_title = search.value;
    this.paginator.currentPage = 0;
    this.currentSelect = [];
    this.getDashboardList();
  }

  public getSortList(column: TDashboardColumnName): void {
    if (column === this.sortColumn) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.currentSelect = [];
    this.getDashboardList();
  }

  public setAllCheckbox(checked: boolean, allPage: boolean = false): void {
    if (allPage) {
      this.currentSelect = [];
    }
    this.dashboardList.forEach((dashboard) => {
      dashboard.select = checked;
      this.changeSelect(checked, dashboard);
    });
  }

  public setFavoriteStatus(dashboard: IDashboardDatasource, all: boolean = false): void {
    if (all || !dashboard) {
      const arr = [];
      this.allFavorite = true;

      this.dashboardList.forEach((dashboard) => {
        arr.push(dashboard.id);

        if (!dashboard.favorite) {
          this.allFavorite = false;
        }
      });

      this.store.dispatch(
        DashboardSetFavoriteStatus({
          payload: {
            data: arr,
            select: !this.allFavorite,
          },
        })
      );
    } else {
      this.store.dispatch(
        DashboardSetFavoriteStatus({
          payload: {
            data: [dashboard.id],
            select: !dashboard.favorite,
          },
        })
      );
    }

    if (this.dashboardPins[dashboard.id]) {
      this.togglePinMainPage(dashboard, false);
    }
  }

  public editDashboard(dashboard: IDashboard): void {
    this.router.navigate(['/main/dashboard/edit', dashboard.id]).then();
  }

  public redirectToDashboard(dashboard: IDashboard): void {
    if (this.permissions.canRead) {
      this.router.navigate(['/main/dashboard', dashboard.id]).then();
    }
  }

  public deleteDashboard(id: number): void {
    this.store.dispatch(DashboardDelete({ payload: id }));
  }

  public deleteSelectedDashboards(): void {
    const arr = this.currentSelect;
    if (arr.length === 1) {
      this.deleteDashboard(arr[0]);
      return;
    }
    this.store.dispatch(DashboardMultipleDelete({ payload: arr }));
  }

  public getGroupDeleteButtonText(): string {
    const count = this.getSelectCount();
    const lastDigit = count % 10;
    let text = ' аналитические панели выделено';

    if ((count > 10 && count < 20) || lastDigit > 4 || lastDigit === 0) {
      text = ' аналитических панелей выделено';
    } else if (lastDigit === 1) {
      text = ' аналитическая панель выделена';
    }

    return count + text;
  }

  public isCheckedAll(): boolean {
    return this.dashboardList?.every((dashboard) => dashboard.select);
  }

  public someCheckedCurrentPage(): boolean {
    return this.dashboardList?.some((dashboard) => dashboard.select);
  }

  public someCheckedAllPage(): boolean {
    return !!this.currentSelect.length;
  }

  public someButNotAtAllChecked(): boolean {
    return this.someCheckedCurrentPage() && !this.isCheckedAll();
  }

  public exportDashboard(dashboard: IDashboardDatasource): void {
    this.store.dispatch(DashboardExport({ payload: [dashboard.id] }));
  }

  public togglePinMainPage(dashboard: IDashboardDatasource, isPin: boolean): void {
    if (isPin) {
      this.dashboardPins[dashboard.id] = { id: dashboard.id, pin: isPin };
    } else {
      this.dashboardPins[dashboard.id] = undefined;
    }

    this.store.dispatch(
      DashboardPin({
        payload: {
          id: dashboard.id,
          isPin,
          callback: (error) => {
            if (error) {
              console.log('DashboardPin', error);

              if (isPin) {
                this.dashboardPins[dashboard.id] = undefined;
              } else {
                this.dashboardPins[dashboard.id] = { id: dashboard.id, pin: isPin };
              }
            }

            this.store.dispatch(DashboardGetPins());
          },
        },
      })
    );
  }

  public changeViewMode(viewMode: TViewMode): void {
    this.paginator.pageSize = viewMode === 'tile' ? 8 : 10;
    this.viewMode = viewMode;
    this.getDashboardList();
  }

  private initDashboardsList(res: dashboardState): void {
    if (res.needUpdate) {
      this.currentSelect = [];
      this.getDashboardList();
      return;
    }
    if (Array.isArray(res.info.permissions) && res.info.permissions.length) {
      const canRead = !!res.info.permissions.find((item) => item === 'can_read');
      const canWrite = !!res.info.permissions.find((item) => item === 'can_write');
      this.permissions = { canRead, canWrite };
    }
    const favoriteStatus = {};
    if (res.favoriteData && res.favoriteData.length) {
      res.favoriteData.forEach((item) => {
        favoriteStatus[item.id] = item.value;
      });
    }
    if (res.data) {
      const list = [];
      this.allFavorite = true;
      res.data.result.forEach((item) => {
        const favorite = !!favoriteStatus[item.id];
        if (!favorite) {
          this.allFavorite = false;
        }
        list.push({
          ...item,
          favorite,
          formatOwnersFullName: item.owners.map((own) => `${own.first_name} ${own.last_name}`),
          formatOwners: item.owners.map((owner) => `${owner.first_name[0]}${owner.last_name[0]}`),
          changed_on: moment(item.changed_on_utc).format('DD.MM.YY HH:mm'),
          select: this.isSelectItem(item),
        });
      });
      this.dashboardList = list;
      this.paginator.count = res.data.count;
    }
    this.dialogService.errorHandler(res);
  }

  private initStateByUrl(router: fromRouter.RouterReducerState<RouterStateUrl>): void {
    const queryParams = router?.state?.queryParams;
    const queryParamsKeys = Object.keys(queryParams);
    if (queryParamsKeys.length) {
      queryParamsKeys.forEach((item) => {
        switch (item) {
          case 'viewMode':
          case 'sortColumn':
          case 'sortOrder':
            this[item as any] = queryParams[item];
            break;
          case 'pageIndex':
            this.paginator.currentPage = +queryParams[item];
            break;
          case 'filters':
            const filters: any = rison.decode(queryParams[item]);
            if (filters) {
              this.filterState = { ...this.filterState, ...filters };
              const pof = [];
              if (filters.published) {
                pof.push('published');
              } else if (filters.published === false) {
                pof.push('draft');
              }
              if (filters.favorite) {
                pof.push('favorite');
              }
              this.filterFormGroup.setValue(
                {
                  owners: filters.owners ?? null,
                  created_by: filters.created_by ?? null,
                  published_or_favorite: pof,
                },
                { emitEvent: false }
              );
              this.searchFormControl.setValue(filters.dashboard_title, { emitEvent: false });
            }
            break;
        }
      });
    }
    this.routerState = router;
  }

  private getSelectCount(): number {
    return this.currentSelect.length;
  }

  private setRelatedData(data): void {
    if (data.owners?.length) {
      this.owners = [...data.owners];
    }
    if (data.creators?.length) {
      this.creators = [...data.creators];
    }
    this.dialogService.errorHandler(data);
  }

  private getDashboardList(): void {
    this.store.dispatch(
      DashboardListGet({
        payload: {
          filters: this.getFilters(),
          order_column: this.sortColumn,
          order_direction: this.sortOrder,
          page: this.paginator.currentPage,
          page_size: this.paginator.pageSize,
        },
      })
    );
    this.setQueryParams();
  }

  private getFilters(): any[] {
    const filters = [];
    Object.keys(this.filterState).forEach((key) => {
      if (this.filterState[key] !== null) {
        filters.push({
          col: this.filtersOptions[key].column,
          opr: this.filtersOptions[key].operation,
          value: this.filterState[key],
        });
      }
    });

    return filters;
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

  private setQueryParams(): void {
    const filters = {};
    Object.keys(this.filterState).forEach((key) => {
      if (this.filterState[key] !== null) {
        filters[key] = this.filterState[key];
      }
    });
    const queryParams: Params = {
      filters: rison.encode(filters),
      viewMode: this.viewMode,
      sortColumn: this.sortColumn,
      sortOrder: this.sortOrder,
      pageIndex: this.paginator.currentPage,
    };
    this.router
      .navigate([], {
        queryParams,
        relativeTo: this.activatedRoute,
        queryParamsHandling: 'merge',
      })
      .then();
  }

  public changeSelect(checked: boolean, dashboard: IDashboard): void {
    if (checked) {
      this.currentSelect.push(+dashboard.id);
      return;
    }
    this.currentSelect = this.currentSelect.filter((id) => id !== +dashboard.id);
  }

  private isSelectItem(dashboard: IDashboard): boolean {
    return !!~this.currentSelect.indexOf(dashboard.id);
  }

  public async confirmDeletion(
    dashboard: IDashboard[],
    // Чтобы обойти случай, когда нет возможности определить имя дашборда, когда выбран (чекбокс)
    // 1 элемент из списка - получаем список dashboardIDs (если страницу переключить, то у нас
    // негде искать выбранные дашборды с предыдущей страницы).
    operation: 'one' | 'several'
  ): Promise<any> {
    let title = '';
    let text = '';

    if (operation === 'one') {
      title = 'Удаление аналитической панели';
      text = `Точно ли Вы хотите удалить аналитическую панель "${dashboard[0].dashboard_title}"?`;
    } else if (operation === 'several') {
      title = 'Удаление нескольких аналитических панелей';

      const message = this.declOfNum(dashboard.length, [
        'выбранную аналитическую панель',
        'выбранные аналитические панели',
        'выбранных аналитических панелей',
      ]);

      text = `Точно ли Вы хотите удалить ${dashboard.length} ${message}?`;
    } else {
      console.log('confirmDeletion / Необработанный сценарий #1');
    }

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
          if (operation === 'one') {
            this.deleteDashboard(dashboard[0].id);
          } else if (operation === 'several') {
            this.deleteSelectedDashboards();
          } else {
            console.log('confirmDeletion / Необработанный сценарий #2');
          }
        }
      });
  }

  private declOfNum(number: number, titles: string[]): string {
    const cases = [2, 0, 1, 1, 1, 2];

    return titles[
      number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]
    ];
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
