import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { selectDatabaseValidationState } from '@store/selectors/database/database.selector';
import {
  DatabaseCreateWithForm,
  DatabaseValidateParameters,
} from '@store/actions/database/database.actions';
import { IAvailableData, IDatabaseProperties } from '@models/database/database.model';
import { Subject } from 'rxjs';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-database-parameters-form',
  templateUrl: './database-parameters-form.component.html',
  styleUrls: ['./database-parameters-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DatabaseParametersFormComponent implements OnInit {
  public formGroup: FormGroup;
  public generalErrors: string;
  public formValid = false;
  @Input() public database: IAvailableData;
  @Input() public properties: IDatabaseProperties;
  @Output() public onSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() public validForm: EventEmitter<boolean> = new EventEmitter<boolean>();
  private _destroy$ = new Subject<null>();

  constructor(private store: Store, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group(this.getFormGroupConfig());
    this.store
      .pipe(takeUntil(this._destroy$), select(selectDatabaseValidationState))
      .subscribe((res) => {
        let generalErrors = '';
        Object.keys(this.formGroup.controls).forEach((key) => {
          this.formGroup.controls[key].setErrors(null);
        });
        if (res.data) {
          this.validForm.emit(true);
          this.generalErrors = generalErrors;
          return;
        }

        this.validForm.emit(false);
        if (Array.isArray(res.error?.errors)) {
          res.error.errors.forEach((error) => {
            if (Array.isArray(error.extra?.invalid)) {
              error.extra.invalid.forEach((key) => {
                this.getFormControl(key).setErrors({ serverMessage: error.message });
              });
              generalErrors = 'Заполните форму корректно! ';
              return;
            }

            generalErrors += ' ' + error.message;
          });
        }
        this.generalErrors = generalErrors;
      });
  }

  private getFormGroupConfig(): { [key: string]: any } {
    const res: { [key: string]: any } = {};
    const params = this.database.parameters?.properties;
    Object.keys(params).map((key) => {
      const validators = [];
      const max = params[key]?.maximum;
      const min = params[key]?.minimum;
      const type = params[key]?.type;
      const required = this.database.parameters?.required?.includes(key);
      let initValue = null;
      if (min) {
        validators.push(Validators.min(min));
      }
      if (max) {
        validators.push(Validators.max(max));
      }
      if (required) {
        validators.push(Validators.required);
      }
      switch (type) {
        case 'boolean':
          initValue = false;
          break;
        case 'string':
          initValue = '';
          break;
        case 'integer':
          initValue = null;
          break;
        case 'object':
          initValue = '';
          break;
      }
      res[key] = [initValue, validators];
    });
    res.display_name = [this.database.name, [Validators.required]];
    console.log(res);
    return res;
  }

  public getFormControl(name: keyof IDatabaseProperties): FormControl {
    return this.getAbstractControl<FormControl>(name);
  }

  public getAbstractControl<Type extends AbstractControl>(name: keyof IDatabaseProperties): Type {
    return this.formGroup?.get(name) as Type;
  }

  public onBlur(): void {
    this.store.dispatch(
      DatabaseValidateParameters({
        payload: this.getFormData(),
      })
    );
  }

  public save(): void {
    this.store.dispatch(
      DatabaseCreateWithForm({
        payload: this.getFormData(),
      })
    );
  }

  private getFormData(): any {
    const query = {};
    this.formGroup.value.query.split('&').map((paramPair) => {
      const [key, value] = paramPair.split('=');
      if (key) {
        query[key] = value;
      }
    });
    const value = { ...this.formGroup.value };
    delete value.display_name;
    return {
      catalog: [{ value: '', name: '' }],
      configuration_method: 'dynamic_form',
      database_name: this.formGroup.value.display_name,
      engine: this.database.engine,
      parameters: { ...value, query },
      query_input: this.formGroup.value.query,
    };
  }
}
