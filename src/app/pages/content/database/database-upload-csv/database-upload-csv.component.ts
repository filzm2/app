import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import {select, Store} from "@ngrx/store";
import { IDatabaseUploadCsvData } from "@models/database/database-upload.model";
import { turn180, verticalHide } from "@page/content/database/database.animation";
import {Observable, Subject} from "rxjs";
import {
  selectDatabasesCSVState,
  selectDatabaseUploadState,
  selectSchemasCSVState
} from "@store/selectors/database/database.selector";
import {DatabasesCSV, DatabaseUploadClear, GetSchemasForCSV, UploadCSV} from "@store/actions/database/database.actions";
import {MatSelectChange} from "@angular/material/select";
import {Router} from "@angular/router";
import {DialogService} from "@core/services/dialog.service";
import {takeUntil, tap} from "rxjs/operators";

@Component({
  selector: 'app-database-upload-csv',
  templateUrl: './database-upload-csv.component.html',
  styleUrls: ['./database-upload-csv.component.scss'],
  animations: [turn180, verticalHide],
  encapsulation: ViewEncapsulation.None,
})
export class DatabaseUploadCsvComponent implements OnInit, OnDestroy {

  public formGroup: FormGroup;
  public stateExpandedAnimation: 'open' | 'close' = 'close';
  public schemas$: Observable<any>;
  public databases$: Observable<any>;
  private file: any;
  private _destroy$ = new Subject();
  constructor(private fb: FormBuilder, private store: Store, private router: Router, private dialog: DialogService) {
    // this.schemas$ = this.store.pipe(select(selectSchemasCSVState));
    // this.databases$ = this.store.pipe(select(selectDatabasesCSVState));
    // this.store.dispatch(DatabasesCSV());
    this.store.pipe(takeUntil(this._destroy$), select(selectDatabaseUploadState)).subscribe(res => {
      if(res.success) {
        this.store.dispatch(DatabaseUploadClear());
        this.routeBack();
      }
      this.dialog.errorHandler(res);
    })
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      table_name: ['', [Validators.required]],
      csv_file: '',
      database: [{value: 'PostgreSQL', disabled: true}],
      schema: [{value: 'schema_of_files', disabled: true}],
      delimiter: ',',
      if_exists: ['fail', [Validators.required]],
      header_row: 0,
      index_col: '',
      mangle_dupe_cols: true,
      skip_initial_space: false,
      decimal: '.',
      index_label: '',
      parse_dates: false,
      dataframe_index: false,
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this.store.dispatch(DatabaseUploadClear());
  }

  public routeBack(): void {
    this.router.navigate([ 'main', 'dataset' ]).then();
  }

  public saveChanges(): void {
    const fileControl = this.getFormControl('csv_file');
    if (!this.file || this.formGroup.invalid) {
      if (!this.file) {
        fileControl.setErrors({required: true});
      }
      this.formGroup.markAllAsTouched();
      return;
    }
    const value = this.formGroup.value;
    const formData = new FormData();
    formData.append('csv_file', this.file, 'csv_file.csv');
    formData.append('table_name', value.table_name);
    formData.append('database', '53');
    formData.append('schema', 'schema_of_files');
    formData.append('delimiter', value.delimiter);
    formData.append('if_exists', value.if_exists);
    formData.append('header_row', value.header_row);
    formData.append('index_col', value.index_col);
    formData.append('mangle_dupe_cols', value.mangle_dupe_cols);
    formData.append('skip_initial_space', value.skip_initial_space);
    formData.append('decimal', value.decimal);
    formData.append('index_label', value.index_label);
    formData.append('parse_dates', value.parse_dates);
    formData.append('dataframe_index', value.dataframe_index);
    formData.append('null_values', value.null_values);

    this.store.dispatch(UploadCSV({payload: formData}));
  }

  public getFormControl(name: keyof IDatabaseUploadCsvData): FormControl {
    return this.getAbstractControl<FormControl>(name);
  }

  public getAbstractControl<Type extends AbstractControl>(name: keyof IDatabaseUploadCsvData): Type {
    return this.formGroup?.get(name) as Type;
  }

  public toggleExpandedState(): void {
    this.stateExpandedAnimation = this.stateExpandedAnimation === 'open' ? 'close' : 'open';
  }

  public databaseSelected(event: MatSelectChange) {
    // this.store.dispatch(GetSchemasForCSV({payload: event.value}));
  }

  public uploadFile(file: any): void {
    this.file = file;
    this.getFormControl('csv_file').updateValueAndValidity();
  }
}
