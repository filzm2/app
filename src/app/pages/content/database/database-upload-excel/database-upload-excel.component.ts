import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import {select, Store} from "@ngrx/store";
import { IDatabaseUploadExcelData } from "@models/database/database-upload.model";
import { turn180, verticalHide } from "@page/content/database/database.animation";
import {Observable, Subject} from "rxjs";
import {Router} from "@angular/router";
import {DialogService} from "@core/services/dialog.service";
import {
  selectDatabasesCSVState, selectDatabasesExcelState,
  selectDatabaseUploadState,
  selectSchemasCSVState, selectSchemasExcelState
} from "@store/selectors/database/database.selector";
import {
  DatabasesCSV,
  DatabasesExcel,
  DatabaseUploadClear,
  GetSchemasForCSV,
  UploadCSV, UploadExcel
} from "@store/actions/database/database.actions";
import {takeUntil} from "rxjs/operators";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-database-upload-excel',
  templateUrl: './database-upload-excel.component.html',
  styleUrls: ['../database-upload-csv/database-upload-csv.component.scss'],
  animations: [turn180, verticalHide],
  encapsulation: ViewEncapsulation.None,

})
export class DatabaseUploadExcelComponent implements OnInit {

  public formGroup: FormGroup
  public stateExpandedAnimation: 'open' | 'close' = 'close';
  public availableFormats = ['xls', 'xlsx'];
  public schemas$: Observable<any>;
  public databases$: Observable<any>;
  private file: any;
  private _destroy$ = new Subject();

  constructor(private fb: FormBuilder, private store: Store, private router: Router, private dialog: DialogService) {
    // this.schemas$ = this.store.pipe(takeUntil(this._destroy$), select(selectSchemasExcelState));
    // this.databases$ = this.store.pipe(takeUntil(this._destroy$), select(selectDatabasesExcelState));
    // this.store.dispatch(DatabasesExcel());
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
      excel_file: '',
      sheet_name: '',
      database: [{value: 'PostgreSQL', disabled: true}],
      schema: [{value: 'schema_of_files', disabled: true}],
      if_exists: ['fail', [Validators.required]],
      header_row: 0,
      index_col: '',
      mangle_dupe_cols: true,
      dataframe_index: false,
      decimal: '.',
      parse_dates: false,
      index_label: '',
    });
  }

  public routeBack(): void {
    this.router.navigate([ 'main', 'dataset' ]).then();
  }

  public saveChanges(): void {
    const fileControl = this.getFormControl('excel_file');

    if (!this.file || this.formGroup.invalid) {
      if (!this.file) {
        fileControl.setErrors({required: true});
      }
      this.formGroup.markAllAsTouched();
      return;
    }
    const value = this.formGroup.value;
    const formData = new FormData();
    formData.append('excel_file', this.file, 'excel_file.csv');
    formData.append('table_name', value.table_name);
    formData.append('sheet_name', value.sheet_name);
    formData.append('database', '53');
    formData.append('schema', 'schema_of_files');
    formData.append('if_exists', value.if_exists);
    formData.append('header_row', value.header_row);
    formData.append('index_col', value.index_col);
    formData.append('mangle_dupe_cols', value.mangle_dupe_cols);
    formData.append('decimal', value.decimal);
    formData.append('index_label', value.index_label);
    formData.append('parse_dates', value.parse_dates);
    formData.append('dataframe_index', value.dataframe_index);
    formData.append('null_values', value.null_values);

    this.store.dispatch(UploadExcel({payload: formData}));
  }

  public getFormControl(name: keyof IDatabaseUploadExcelData): FormControl {
    return this.getAbstractControl<FormControl>(name);
  }

  public getAbstractControl<Type extends AbstractControl>(name: keyof IDatabaseUploadExcelData): Type {
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
    this.getFormControl('excel_file').updateValueAndValidity();
  }
}
