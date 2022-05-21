import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { of, Subject } from 'rxjs';
import { nanoid } from 'nanoid';
import { Router } from '@angular/router';
import { ITab, ITabButtonSettings } from '@page/content/dataset/dataset.interface';
import { select, Store } from '@ngrx/store';
import * as appState from '@store/reducers';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators as v,
} from '@angular/forms';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { IColumn } from '@models/dataset/dataset-columns.model';
import {
  DatasetDeleteColumn,
  DatasetSyncColumns,
  DatasetSyncColumnsClear,
  DatasetUpdateClear,
} from '@store/actions/dataset/dataset.actions';
import { FormService } from '@core/services/form.service';
import { selectDatasetState } from '@store/selectors/dataset/dataset.selector';
import { IDatasetSettings } from '@models/dataset/dataset-edit-settings.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dataset-edit-columns',
  templateUrl: './dataset-edit-columns.component.html',
  styleUrls: ['./dataset-edit-columns.component.scss'],
})
export class DatasetEditColumnsComponent implements OnInit, OnDestroy, ITab {
  public tabButtonSettings: ITabButtonSettings;
  public columns: IColumn[];
  public formGroup: FormGroup;
  public expanded: number;
  public readonly DATA_TYPES = [
    { value: 'STRING', label: 'Строчный' },
    { value: 'NUMERIC', label: 'Числовой' },
    { value: 'DATETIME', label: 'Дата' },
    { value: 'BOOLEAN', label: 'Логический' },
  ];
  private data: IDatasetSettings;
  private lockDelete: boolean;

  @Input()
  public set calculated(value) {
    this._calculated = value;
    if (value) {
      this.tabButtonSettings = {
        label: 'Добавить элемент',
        icon: 'plus',
      };
      return;
    }

    this.tabButtonSettings = {
      label: 'Синхронизация столбцов из источника',
      icon: 'pancakes',
    };
  }

  public get calculated(): boolean {
    return this._calculated;
  }

  constructor(
    private router: Router,
    private store: Store<appState.State>,
    private fb: FormBuilder,
    private formService: FormService,
    private snack: MatSnackBar
  ) {}

  private _destroy$ = new Subject<null>();
  private _calculated: boolean;
  private datasetId: number;

  public ngOnInit(): void {
    this.store.pipe(takeUntil(this._destroy$), select(selectDatasetState)).subscribe((data) => {
      const syncColumns = data.syncColumns?.result;
      if (Array.isArray(syncColumns) && !this.calculated && this.columns) {
        const finalColumns: IColumn[] = [];
        const currentCols = this.columns.reduce(
          (acc, col) => ({
            ...acc,
            [col.column_name]: col,
          }),
          {}
        );
        syncColumns.forEach((item) => {
          const currentCol = currentCols[item.name];
          const isModified =
            currentCol && (currentCol.type !== item.type || (!currentCol.is_dttm && item.is_dttm));

          if (!currentCol) {
            // new column
            finalColumns.push({
              id: nanoid(),
              column_name: item.name,
              type: item.type,
              filterable: true,
              groupby: true,
              is_dttm: item.is_dttm,
            });
          } else if (isModified) {
            // modified column
            finalColumns.push({
              ...currentCol,
              type: item.type,
              is_dttm: currentCol.is_dttm || item.is_dttm,
            });
          } else {
            // unchanged
            finalColumns.push(currentCol);
          }
        });
        this.columns = finalColumns;
        this.formInit();
        this.snack.open('Синхронизация с источником успешно проведена!', 'x', {
          horizontalPosition: 'end',
          duration: 2000,
        });
        return;
      }

      const syncColumnError = data.syncColumnsError;

      if (syncColumnError) {
        this.snack.open('Ошибка! Не удалось провести синхронизацию!', 'x', {
          horizontalPosition: 'end',
          duration: 2000,
        });
        return;
      }

      if (data?.data) {
        this.datasetId = data?.data?.id;
        this.data = data.data?.result;
        this.columns = data?.data?.result?.columns || [];
        this.columns = this.columns.filter((item) => {
          return this.calculated ? !!item.expression : !item.expression;
        });
        this.formInit();
      }
    });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public formInit(): void {
    const groups: FormGroup[] = [];
    this.columns.forEach((item) => {
      const expression = this.calculated
        ? item.expression || '<enter SQL expression here>'
        : item.expression;
      const group = this.fb.group({
        verbose_name: item.verbose_name,
        column_name: [item.column_name, [v.required, v.maxLength(255)]],
        description: item.description,
        filterable: item.filterable,
        groupby: item.groupby,
        is_active: item.is_active,
        is_dttm: item.is_dttm,
        id: item.id,
        type: [item.type, [v.required]],
        python_date_format: [item.python_date_format, [v.maxLength(255)]],
        uuid: item.uuid,
        expression,
      });
      groups.push(group);
    });
    this.formGroup = this.fb.group({
      columns: this.fb.array([...groups]),
    });
  }

  public getFormArray(): FormArray {
    return this.formGroup.get('columns') as FormArray;
  }

  public deleteItem(i: number, event: Event): void {
    event.stopPropagation();
    const array = this.getFormArray();
    array.removeAt(i);
  }

  public addItem(): void {
    this.getFormArray().push(
      this.fb.group({
        verbose_name: '',
        column_name: ['', [v.required, v.maxLength(255)]],
        description: '',
        filterable: true,
        groupby: true,
        is_active: true,
        is_dttm: false,
        expression: '',
        id: null,
        type: ['', [v.required]],
        python_date_format: ['DD/MM/YYYY', [v.maxLength(255)]],
        uuid: null,
      })
    );
  }

  public getControlByName(name: string, group: AbstractControl): FormControl {
    return group.get(name) as FormControl;
  }

  public setStep(id: number): void {
    this.expanded = id;
  }

  public focusHiddenField(elem: HTMLElement, event: Event): void {
    elem.focus();
    event.stopPropagation();
  }

  public getTabActionCallback(): () => void {
    return this.calculated ? () => this.addItem() : () => this.syncColumns();
  }

  public getDataTypes(): any[] {
    return this.DATA_TYPES;
  }

  public syncColumns(): void {
    this.store.dispatch(
      DatasetSyncColumns({
        payload: {
          database_name: this.data.database.database_name,
          datasource_type: this.data.datasource_type,
          schema_name: this.data.schema,
          table_name: this.data.table_name,
        },
      })
    );
  }

  public getErrors(control: FormControl): string {
    return this.formService.getErrorMessage(control);
  }
}
