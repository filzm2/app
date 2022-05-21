import {Component, OnDestroy, OnInit, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {MatTabChangeEvent} from '@angular/material/tabs/tab-group';
import {ITabButtonSettings} from '@page/content/dataset/dataset.interface';
import {takeUntil} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {
  DatasetClear,
  DatasetSave,
  DatasetUpdateClear,
  DatasetUpdateClearHard
} from '@store/actions/dataset/dataset.actions';
import {MatDialog} from '@angular/material/dialog';
import {PopupWarningComponent} from '@shared/components/popups/popup-warning/popup-warning.component';
import {IMetric} from "@models/dataset/dataset-metrics.model";
import {IColumn} from "@models/dataset/dataset-columns.model";
import {IDatasetSettings} from "@models/dataset/dataset-edit-settings.model";
import {DialogService} from "@core/services/dialog.service";
import {selectDatasetUpdateState} from "@store/selectors/dataset/dataset.selector";
import {IUser} from "@models/user/user.model";

@Component({
  selector: 'app-dataset-edit',
  templateUrl: './dataset-edit.component.html',
  styleUrls: ['./dataset-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatasetEditComponent implements OnInit, OnDestroy {
  public tabButtonSettings: ITabButtonSettings;
  public data: any;
  @ViewChildren('tab0, tab1, tab2, tab3, tab4') private tabs: QueryList<any>;
  private _destroy$ = new Subject<null>();
  private isViewDataset: string;
  public tabActionCallback = () => {
  };

  constructor(
    private router: Router,
    private store: Store,
    private dialog: MatDialog,
    private dialogService: DialogService,
  ) {
    this.store.pipe(takeUntil(this._destroy$), select('dataset' as any))
      .subscribe((res: any) => {
        if (res.syncColumns || res.syncColumnsError) {
          return;
        }
        if (res.data) {
          this.data = res.data.result;
        }
      });
    this.store.pipe(takeUntil(this._destroy$), select(selectDatasetUpdateState))
      .subscribe((res) => {
        if (res.redirect) {
          if (this.isViewDataset) {
            this.router.navigate(['/main/dataset/detail/', this.data.id]).then();
          } else {
            this.router.navigate(['/main/dataset/']).then();
          }
          this.store.dispatch(DatasetUpdateClearHard());
        }
        this.dialogService.errorHandler(res);
      });
  }

  public async ngOnInit(): Promise<void> {
    const searchParams = new URLSearchParams(location.search);
    const datasetId = searchParams.get('id');
    this.isViewDataset = searchParams.get('view');

    if (!datasetId) {
      await this.router.navigate(['/main/dataset']);
    }
  }

  public async saveChanges(): Promise<any> {
    this.dialog.open(PopupWarningComponent, {
      data: {
        title: 'Измененить набор данных',
        text: 'Изменение набора данных может привести к поломке диаграммы, если диаграмма основана на столбцах или метаданных, которых нет в целевом наборе данных.',
        btnSuccessTitle: 'Продолжить',
        btnCancelTitle: 'Отмена'
      }
    }).afterClosed().pipe(takeUntil(this._destroy$)).subscribe((data) => {
      if (!data) {
        return;
      }
      let columns = [];
      let valid = true;
      const payload: IDatasetSettings = this.tabs.reduce((acc: IDatasetSettings, value) => {
        if (!value.formGroup.valid) {
          value.formGroup.markAllAsTouched();
          valid = false;
        }
        if (value.formGroup.value.columns) {
          columns = [...columns, ...value.formGroup.value.columns];
        }
        return {...acc, ...value.formGroup.value, columns};
      }, {...this.data});
      payload.type = payload.type || payload.datasource_type;
      payload.metrics = payload.metrics.map((metric: IMetric) => {
        return {
          ...metric,
          warning_text: metric.warning_markdown,
          extra: this.buildExtraJsonObject(metric),
          is_certified: !!(metric.certified_by || metric.certification_details)
        };
      });
      payload.columns = payload.columns.map((column: IColumn) => {
        return {
          ...column,
          extra: this.buildExtraJsonObject(column)
        };
      });
      payload.owners = (payload.owners as IUser[]).map((item) => item.id || item)
      console.log(payload);


      const formData = new FormData()
      formData.append('data', JSON.stringify(payload));
      this.store.dispatch(DatasetSave({
        payload: {id: this.data.id, data: formData},
      }));
      return;
    });
  }

  public tabChange(event: MatTabChangeEvent): void {
    const tab = this.tabs.get(event.index);
    this.tabButtonSettings = tab.tabButtonSettings;
    this.tabAction = tab.getTabActionCallback();
  }

  public async routeBack(): Promise<void> {
    if (this.isViewDataset) {
      await this.router.navigate(['/main/dataset/detail/', this.data.id]);
    } else {
      await this.router.navigate(['/main/dataset/']);
    }
  }

  public async tabAction(): Promise<void> {
    this.tabActionCallback();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private buildExtraJsonObject(item: any): string {
    const certification =
      item?.certified_by || item?.certification_details
        ? {
          certified_by: item?.certified_by,
          details: item?.certification_details,
        }
        : undefined;
    return JSON.stringify({
      certification,
      warning_markdown: item?.warning_markdown,
    });
  }
}
