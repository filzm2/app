import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as appState from '@store/reducers';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { selectDatabaseAvailableState } from '@store/selectors/database/database.selector';
import {
  DatabaseAvailableGet,
  DatabaseCreate,
  DatabaseSave,
} from '@store/actions/database/database.actions';
import { IAvailableData } from '@models/database/database.model';
import { IDatabaseSettings } from '@models/database/database-settings.model';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { DatasetSchemaGet } from '@store/actions/dataset/dataset.actions';

@Component({
  selector: 'app-database-sql-alchemy-form',
  templateUrl: './database-sql-alchemy-form.component.html',
  styleUrls: ['./database-sql-alchemy-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DatabaseSqlAlchemyFormComponent implements OnInit, OnChanges {
  public formGroup: FormGroup;
  @Input() private data: IDatabaseSettings;
  @Input() private databaseId: number;
  @Input() public withConnection = true;
  private availableData: IAvailableData[];
  private _destroy$ = new Subject<null>();
  private extraData: any = {};
  public schemas: any[] = [];
  constructor(
    private store: Store<appState.State>,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.initFormGroup(null);
  }

  ngOnInit(): void {
    this.store
      .pipe(takeUntil(this._destroy$), select(selectDatabaseAvailableState))
      .subscribe((res) => (this.availableData = res));

    this.store.pipe(takeUntil(this._destroy$), select('datasetSchema')).subscribe((res) => {
      if (Array.isArray(res.data?.result)) {
        const result = res.data.result.map((schema) => {
          return { text: schema, value: schema, id: schema };
        });

        this.schemas = result;
      }
      if (res.error) {
        this.schemas = [];
      }
    });

    this.store.dispatch(DatabaseAvailableGet());
    if (this.databaseId) {
      this.store.dispatch(DatasetSchemaGet({ payload: { database: this.databaseId } }));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data?.currentValue && changes.data?.currentValue !== changes.data?.previousValue) {
      this.initFormGroup(this.data);
    }
  }

  private initFormGroup(data: IDatabaseSettings): void {
    if (data?.extra) {
      this.extraData = JSON.parse(data.extra);
    }
    let csvUpload = [];
    let encryptedExtra = '';
    if (Array.isArray(this.extraData?.schemas_allowed_for_csv_upload)) {
      csvUpload = this.extraData?.schemas_allowed_for_csv_upload.map((schema) => schema.trim());
      // csvUpload = ['123456'];
    }
    if (data?.encrypted_extra) {
      encryptedExtra = JSON.parse(data.encrypted_extra);
    }
    this.formGroup = this.fb.group({
      allow_csv_upload: data?.allow_csv_upload ?? false,
      allow_ctas: data?.allow_ctas ?? false,
      allow_cvas: data?.allow_cvas ?? false,
      allow_dml: data?.allow_dml ?? false,
      allow_multi_schema_metadata_fetch: data?.allow_multi_schema_metadata_fetch ?? false,
      allow_run_async: data?.allow_run_async ?? false,
      cache_timeout: data?.cache_timeout ?? 0,
      configuration_method: data?.configuration_method ?? 'sqlalchemy_form',
      database_name: [data?.database_name ?? '', [Validators.required]],
      encrypted_extra: encryptedExtra,
      engine: data?.engine ?? '',
      expose_in_sqllab: data?.expose_in_sqllab ?? true,
      extra: data?.extra ?? '',
      force_ctas_schema: data?.force_ctas_schema ?? '',
      impersonate_user: data?.impersonate_user ?? false,
      server_cert: data?.server_cert ?? '',
      sqlalchemy_uri: data?.sqlalchemy_uri ?? '',
      parameters: data?.parameters ?? null,
      cost_estimate_enabled: this.extraData?.cost_estimate_enabled ?? false,
      allows_virtual_table_explore: this.extraData?.allows_virtual_table_explore ?? false,
      schema_cache_timeout: this.extraData?.metadata_cache_timeout?.schema_cache_timeout ?? 0,
      table_cache_timeout: this.extraData?.metadata_cache_timeout?.table_cache_timeout ?? 0,
      cancel_query_on_windows_unload: this.extraData?.cancel_query_on_windows_unload ?? false,
      schemas_allowed_for_csv_upload: [csvUpload],
    });
    if (!(data?.allow_ctas || data?.allow_cvas)) {
      this.getFormControl('force_ctas_schema').disable();
    }
  }

  public saveChanges(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    const value = { ...this.formGroup.value };
    const extraJson = {
      ...this.extraData,
      allows_virtual_table_explore: value.allows_virtual_table_explore,
      cancel_query_on_windows_unload: value.cancel_query_on_windows_unload,
      cost_estimate_enabled: value.cost_estimate_enabled,
      metadata_cache_timeout: {
        schema_cache_timeout: value.schema_cache_timeout,
        table_cache_timeout: value.table_cache_timeout,
      },
      schemas_allowed_for_csv_upload: value.schemas_allowed_for_csv_upload,
    };

    const extra = JSON.stringify(extraJson);
    const encryptedExtra = JSON.stringify(value.encrypted_extra);

    const validateValue = {
      ...this.data,
      ...value,
      extra_json: extraJson,
      encrypted_extra: encryptedExtra,
      extra,
    };

    delete validateValue.allows_virtual_table_explore;
    delete validateValue.cancel_query_on_windows_unload;
    delete validateValue.cost_estimate_enabled;
    delete validateValue.schema_cache_timeout;
    delete validateValue.table_cache_timeout;
    delete validateValue.schemas_allowed_for_csv_upload;

    if (!validateValue.parameters) {
      delete validateValue.parameters;
    }
    console.log(validateValue);
    if (this.databaseId) {
      this.store.dispatch(
        DatabaseSave({
          payload: {
            data: validateValue,
            id: this.databaseId,
          },
        })
      );
      return;
    }

    this.store.dispatch(
      DatabaseCreate({
        payload: validateValue,
      })
    );
  }

  public tabChange($event: MatTabChangeEvent): void {}

  public getFormControl(name: keyof IDatabaseSettings): FormControl {
    return this.getAbstractControl<FormControl>(name);
  }

  public getAbstractControl<Type extends AbstractControl>(name: keyof IDatabaseSettings): Type {
    return this.formGroup?.get(name) as Type;
  }

  public ctasCvasClick(ctas: boolean, cvas: boolean): void {
    const schema = this.getFormControl('force_ctas_schema');
    if (ctas || cvas) {
      schema.enable();
      return;
    }
    schema.setValue('');
    schema.disable();
  }

  public checkInputFieldNumber($event): void {
    const value = Number($event.target.value);

    if (!value || value < 0) {
      $event.target.value = 0;
    }
  }
}
