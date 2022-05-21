import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { IFilter, IFiltersSettings, TAvailableFilters } from "@page/content/security/security.interface";
import { of, Subject } from "rxjs";
import { select, Store } from "@ngrx/store";
import { takeUntil } from "rxjs/operators";
import {
  selectAllPermissionsOptions,
  selectRoleListNameState,
  selectUserListOptions
} from "@store/selectors/security/security.selector";
import {GetAllPermissions, RoleNameListGet, UserRelated} from "@store/actions/settings/security.actions";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit, OnDestroy, AfterViewInit {
  private _destroy$ = new Subject();
  private users$ =  this.store.pipe(takeUntil(this._destroy$), select(selectUserListOptions));
  private roles$ = this.store.pipe(takeUntil(this._destroy$), select(selectRoleListNameState));
  private permissions$ = this.store.pipe(takeUntil(this._destroy$), select(selectAllPermissionsOptions));
  public formArray = new FormArray([]);
  @Input() public availableFilters: TAvailableFilters[] = [];
  @Input() public selectedFilters: TAvailableFilters[] = [];
  @Output() private submitFilters = new EventEmitter();
  public filterSettingsMap: IFiltersSettings = {
    role: {
      inputType: 1,
      requestType: 'role',
      label: 'Роли',
      selectOptions: this.roles$,
    },
    created: {
      inputType: 2,
      label: 'Кем создан',
      selectOptions: this.users$
    },
    changed: {
      inputType: 2,
      label: 'Кем изменен',
      selectOptions: this.users$
    },
    name: {
      inputType: 3,
      label: 'Имя',
    },
    surname: {
      inputType: 3,
      label: 'Фамилия',
    },
    login: {
      inputType: 3,
      label: 'Логин',
    },
    status: {
      inputType: 4,
      label: 'Статус',
    },
    email: {
      inputType: 3,
      label: 'E-mail',
    },
    lastLogin: {
      inputType: 5,
      label: 'Последний вход',
    },
    loginCount: {
      inputType: 6,
      label: 'Входов',
    },
    errorCount: {
      inputType: 6,
      label: 'Ошибочных входов',
    },
    createdDate: {
      inputType: 5,
      label: 'Дата создания',
    },
    changedDate: {
      inputType: 5,
      label: 'Дата изменения',
    },
    permissions: {
      inputType: 2,
      label: 'Разрешение',
      selectOptions: this.permissions$,
    },
    roleName: {
      inputType: 3,
      label: 'Наименование',
    },
    user: {
      inputType: 2,
      label: 'Пользователь',
      selectOptions: this.users$,
    },
    table: {
      inputType: 7,
      label: 'Таблица',
      selectOptions: of(['table', 'table2'])
    },
    roles_includes: {
      inputType: 1,
      label: 'Видят',
      selectOptions: of([{text:'Admin', value: 'Admin', id: 1}, {text:'sql_lab', value: 'sql_lab', id: 2}, {text:'sql_lab2', value: 'sql_lab2', id: 3}, {text:'sql_lab3', value: 'sql_lab4', id: 4}, {text:'sql_lab5', value: 'sql_lab5', id: 5}, {text:'sql_lab6', value: 'sql_lab6', id: 6}, {text:'sql_lab7', value: 'sql_lab7', id: 77}, {text:'sql_lab8', value: 'sql_lab8', id: 8}, {text:'sql_lab', value: 'sql_lab', id: 8}, {text:'sql_lab', value: 'sql_lab', id: 90}])
    },
    roles_excludes: {
      inputType: 1,
      label: 'Видят все кроме',
      selectOptions: of([{text:'Admin', value: 'Admin', id: 1}, {text:'sql_lab', value: 'sql_lab', id: 2}, {text:'sql_lab2', value: 'sql_lab2', id: 3}, {text:'sql_lab3', value: 'sql_lab4', id: 4}, {text:'sql_lab5', value: 'sql_lab5', id: 5}, {text:'sql_lab6', value: 'sql_lab6', id: 6}, {text:'sql_lab7', value: 'sql_lab7', id: 77}, {text:'sql_lab8', value: 'sql_lab8', id: 8}, {text:'sql_lab', value: 'sql_lab', id: 8}, {text:'sql_lab', value: 'sql_lab', id: 90}])
    },
    group_key: {
      inputType: 8,
      label: 'Ключевая группа',
    },
    condition: {
      inputType: 9,
      label: 'Условие',
    },
  }
  constructor(private fb: FormBuilder, private store: Store) {
    this.store.dispatch(UserRelated());
    this.store.dispatch(RoleNameListGet());
    this.store.dispatch(GetAllPermissions());
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const selected = [...this.selectedFilters];
    this.selectedFilters = [];
    selected.forEach(filter => {
      this.addFilter(filter);
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public addFilter(name: TAvailableFilters): void {
    this.selectedFilters.push(name);
    this.formArray.push(this.fb.group({mode: this.getModeInitValue(name), value: '', key: name}))
  }

  public deleteFilter(index: number): void {
    this.selectedFilters.splice(index, 1);
    this.formArray.removeAt(index);
  }

  public getFormControl(group: FormGroup, name: string): FormControl {
    return this.getAbstractControl<FormControl>(group, name);
  }

  public getFormGroupFromArray(index: number): FormGroup {
    return this.getAbstractControlFromArray<FormGroup>(index)
  }

  public getAbstractControl<Type extends AbstractControl>(group: FormGroup, name: string): Type {
    return group?.get(name) as Type;
  }

  public getAbstractControlFromArray<Type extends AbstractControl>(index: number): Type {
    return this.formArray.at(index) as Type;
  }

  public selectFilter(name: TAvailableFilters): void {
    if (!this.selectedFilters.includes(name)) {
      this.addFilter(name);
    }
  }

  public getModeInitValue(filter: TAvailableFilters) {
    switch (this.filterSettingsMap[filter].inputType) {
      case 1:
      case 7:
        return null;
      case 2:
      case 4:
      case 5:
      case 6:
      case 8:
      case 9:
        return 'equal_to';
      case 3:
        return 'start_with';
    }
  }

  public getFilteredList(): void {
    const value = [];
    this.formArray.value.forEach?.(filter => {
      if (filter.value instanceof Date) {
        filter.value = filter.value.toISOString();
      }
      if (filter.value || typeof filter.value === 'boolean') {
        value.push(filter);
      }
    })
    console.log(value);
    this.submitFilters.emit(value);
  }

}
