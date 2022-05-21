import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {select, Store} from '@ngrx/store';
import * as appState from '@store/reducers';
import {takeUntil} from 'rxjs/operators';
import {
  DatasetDatabasesGet,
  DatasetGet,
  DatasetSchemaGet,
  DatasetTablesGet,
} from '@store/actions/dataset/dataset.actions';
import { ITab, ITabButtonSettings, ITable } from '@page/content/dataset/dataset.interface';
import {FormBuilder, FormGroup} from '@angular/forms';

type TDataset = { id: number, database_name: string };
type TDatabases = { value: number, text: string }[];

@Component({
  selector: 'app-dataset-edit-database',
  templateUrl: './dataset-edit-database.component.html',
  styleUrls: ['./dataset-edit-database.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DatasetEditDatabaseComponent implements OnInit, OnDestroy, ITab {
  public datasetSelected: number;
  private data: any;
  constructor(
    private store: Store<appState.State>,
    private fb: FormBuilder,
  ) {
  }

  private _destroy$ = new Subject<null>();

  public typeSelected: string = 'physical';
  public tabButtonSettings: ITabButtonSettings = null;
  public formGroup: FormGroup;
  public dataset: TDataset = {id: -1, database_name: ''};
  public databases: TDatabases = [];
  public schemes: string[] = [];
  public tables: ITable[] = [];

  public async ngOnInit(): Promise<void> {
    const searchParams = new URLSearchParams(location.search);
    const datasetId = searchParams.get('id');
    this.formInit();


    if (datasetId) {
      this.store.pipe(takeUntil(this._destroy$), select('dataset'))
        .subscribe((res: any) => this.datasetSubscribe(res));

      this.store.pipe(takeUntil(this._destroy$), select('datasetDatabases'))
        .subscribe((res: any) => this.databasesSubscribe(res));

      this.store.pipe(takeUntil(this._destroy$), select('datasetSchema'))
        .subscribe((res: any) => this.schemasSubscribe(res));

      this.store.pipe(takeUntil(this._destroy$), select('datasetTables'))
        .subscribe((res: any) => this.dataTablesSubscribe(res));

      this.getDataset(datasetId);
      this.getDatabases();
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  datasetSubscribe(res: any): void {
    if (res.data) {
      this.dataset = res.data.result.database as TDataset;
      this.datasetSelected = this.dataset.id;
      this.data = res.data.result;
      this.formInit(res.data.result);
      console.log(res.data.result);
      this.formGroup.valueChanges.subscribe(console.log);
      this.getSchemas();
      this.getTables();
    }
  }

  public formInit(result: any = {sql: '', schema: '', table_name: '', database: {id: 1}}): void {

    this.formGroup = this.fb.group({
      sql: result?.sql,
      schema: result?.schema,
      table_name: result?.table_name,
      database_id: result?.database.id,
    });

    if (result?.sql) {
      this.typeSelected = 'virtual';
    }
  }

  // todo
  datasetListSubscribe(res: any): void {
    if (res.data) {
      console.log('res.data', res.data);
    }
  }

  databasesSubscribe(res: any): void {
    if (res.data) {
      this.databases = res.data.result as TDatabases;
    }
    if (res.error) {
      this.databases = [];
    }
  }

  schemasSubscribe(res: any): void {
    if (res.data) {
      this.schemes = res.data.result as string[];
      this.formInit(this.data);
    }
    if (res.error) {
      this.schemes = [];
    }
  }

  dataTablesSubscribe(res: any): void {
    if (res.data) {
      this.tables = res.data?.result?.options || [];
    }
    if (res.error) {
      this.tables = [];
    }
  }

  getDataset(datasetId: string): void {
    this.store.dispatch(DatasetGet({
      payload: {datasetId},
    }));
  }

  getDatabases(): void {
    this.store.dispatch(DatasetDatabasesGet({
      payload: {
        order_direction: 'desc',
      },
    }));
  }

  getSchemas(): void {
    this.store.dispatch(DatasetSchemaGet({
      payload: {
        database: this.formGroup.get('database_id').value,
        order_direction: 'desc',
      },
    }));
  }

  public getTables(): void {
    this.store.dispatch(DatasetTablesGet({
      payload: {
        database: this.formGroup.get('database_id').value,
        schema: this.formGroup.get('schema').value,
      },
    }));
  }

  public typeChanged(typeName: string): void {
    this.typeSelected = typeName;
  }

  public databaseChanged(sourceId: number): void {
    this.formGroup.get('schema').setValue(null);
    this.formGroup.get('table_name').setValue(null);
    this.getSchemas();
  }

  public schemaChanged(schemaName: string): void {
    this.formGroup.get('table_name').setValue(null);
    this.getTables();
  }

  public tableChanged(tableName: string): void {
  }

  public getTabActionCallback(): () => void {
    return () => {
    };
  }
}
