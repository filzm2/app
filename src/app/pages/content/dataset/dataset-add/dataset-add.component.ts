import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import {
  DatasetCreate,
  DatasetDatabasesGet,
  DatasetTablesGet,
  DatasetSchemaGet, DatasetClear, DatasetListGet, DatasetCreateClear,
} from '@store/actions/dataset/dataset.actions';
import { select, Store } from '@ngrx/store';
import * as appState from '@store/reducers';
import { takeUntil } from 'rxjs/operators';
import {PopupWarningComponent} from '@shared/components/popups/popup-warning/popup-warning.component';
import {MatDialog} from '@angular/material/dialog';
import { ITable } from "@page/content/dataset/dataset.interface";
import { DialogService } from "@core/services/dialog.service";

@Component({
  selector: 'app-dataset-add',
  templateUrl: './dataset-add.component.html',
  styleUrls: ['./dataset-add.component.scss'],
})
export class DatasetAddComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<appState.State>,
    private router: Router,
    private dialog: MatDialog,
    private dialogService: DialogService,
  ) {}

  private _destroy$ = new Subject<null>();

  public dataSourceSelected: number = -1;
  public schemaSelected: string = '';
  public tableSelected: string = '';

  public dataSources: { id: number, name: string }[] = [];
  public schemes: string[] = [];
  public tables: ITable[] = [];

  public ngOnInit(): void {
    this.store.pipe(takeUntil(this._destroy$), select('datasetDatabases'))
      .subscribe((res: any) => this.dataSourcesSubscribe(res));

    this.store.pipe(takeUntil(this._destroy$), select('datasetSchema'))
      .subscribe((res: any) => this.dataSchemesSubscribe(res));

    this.store.pipe(takeUntil(this._destroy$), select('datasetTables'))
      .subscribe((res: any) => this.dataTablesSubscribe(res));

    this.store.pipe(takeUntil(this._destroy$), select('datasetCreate'))
      .subscribe((res: any) => this.datasetCreateSubscribe(res));

    this.getDatabases();
  }
  public sourceChanged(sourceId: number): void {
    this.dataSourceSelected = sourceId;
    this.schemaSelected = null;
    this.tableSelected = null;
    this.getSchemas();
  }

  getSchemas(): void {
    this.store.dispatch(DatasetSchemaGet({
      payload: {
        database: this.dataSourceSelected,
        order_direction: 'desc',
      },
    }));
  }

  public schemaChanged(schemeName: string): void {
    this.schemaSelected = schemeName;
    this.tableSelected = null;
    this.getTables();
  }

  public getTables(): void {
    this.store.dispatch(DatasetTablesGet({
      payload: {
        database: this.dataSourceSelected,
        schema: this.schemaSelected,
      },
    }));
  }

  public tableChanged(tableName: string): void {
    this.tableSelected = tableName;
  }

  public async createDataset(): Promise<void> {
    this.store.dispatch(DatasetCreate({
      payload: {
        owners: [localStorage.getItem('userId')],
        database: this.dataSourceSelected,
        schema: this.schemaSelected,
        table_name: this.tableSelected,
      },
    }));
  }

  public async routeBack(): Promise<void> {
    await this.router.navigate(['/main/dataset']);
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private datasetCreateSubscribe(res: any): void {
    if (res.success && res.id) {
      this.routeBack().then();
      this.store.dispatch(DatasetListGet({
        payload: {
          filters: [],
          order_direction: 'desc',
          page: 0,
          page_size: 25,
        },
      }));
      this.store.dispatch(DatasetCreateClear());
      return;
    }

    this.dialogService.errorHandler(res);
  }

  private getDatabases(): void {
    this.store.dispatch(DatasetDatabasesGet({
      payload: {
        order_direction: 'desc',
      },
    }));
  }

  private dataSourcesSubscribe(res: any): void {
    if (res.data) {
      this.dataSources = [];

      res.data.result.forEach((elem: { value: number, text: string }) => {
        this.dataSources.push({
          id: elem.value,
          name: elem.text,
        });
      });

      if (this.dataSources[0]) {
        this.sourceChanged(this.dataSources[0].id);
      }
    }
  }

  private dataSchemesSubscribe(res: any): void {
    if (res.data) {
      this.schemes = res.data.result;
    }
  }

  private dataTablesSubscribe(res: any): void {
    if (res.data) {
      this.tables = [];
      res.data.result?.options?.forEach((name: ITable) => {
        this.tables.push(name);
      });
    }
  }
}
