import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap, take, tap} from 'rxjs/operators';
import {TasksService} from '../../../../core/services/tasks.service';
import {ICompanyRepresentative} from '../../../../core/interfaces/client-entity.model';

@Component({
  selector: 'app-form-user',
  templateUrl: 'user-form.component.html',
  styleUrls: ['user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @ViewChild(FormGroupDirective) myForm;
  @Input() idbHistory: any = null;
  private USER_LIST: ICompanyRepresentative[] = [];
  @Input() set userList(userList: any[]) {
    this.USER_LIST = userList;
  }
  get userList(): any[] {
    return this.USER_LIST;
  }
  @Output() userForm: EventEmitter<any> = new EventEmitter<any>();
  // используется для записи в idb
  @Input() idbHistoryUserList: any | any[] = [];
  @Output() formSubscriber: EventEmitter<any> = new EventEmitter<any>();
  @Output() topOfficialsList: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  filteredOptions: Observable<any | any[]>;
  options: any[] = [];
  currentUserBadge = null;

  phoneTypes = ['Рабочий', 'Личный'];
  phonePriority = ['Основной', 'Запасной'];

  constructor(
    private tasksService: TasksService
  ) {}

  ngOnInit(): void {
    this.currentUserBadge = this.userList[0];

    this.form = new FormGroup({
      lastName:                 new FormControl('Иванов', Validators.required),
      name:                     new FormControl('Иван', Validators.required),
      fatherName:               new FormControl('Иванович', Validators.required),
      phoneType:                new FormControl('Рабочий', Validators.required),
      phonePriorityType:        new FormControl('Основной', Validators.required),
      // telephoneNumber:          new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      telephoneNumber:          new FormControl('89175554499', [Validators.required]),
      email:                    new FormControl('ivanov@mail.ru', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      birthDate:                new FormControl('22.01.1967', Validators.required),
      firstFace:                new FormControl(true),
      position:                 new FormControl('Генеральный директор', Validators.required)
    });
    // this.setHistory();
  }

  badgeClickHandler(tmp: any): void {
    this.currentUserBadge = this.userList[tmp];
  }

  badgeDeleteHandler(idx): void {
    this.userList.splice(idx, 1);
    this.topOfficialsList.emit(this.userList);
  }
  private _filter(value: any): string[] {
    value = value.map(el =>  {
        return {...el, result: this.tasksService.addressStringCreator(el)};
      }
    );
    return value;
  }

  displayBeatifulDate(date): any {
    const bDate = new Date(Date.parse(date));
    return `${(bDate.getDate() + 1) < 10 ? '0' + (bDate.getDate() + 1) : bDate.getDate()}.${(bDate.getMonth() + 1) < 10 ? '0' + (bDate.getMonth() + 1) : bDate.getMonth()}.${bDate.getFullYear()}`;
  }

  submitHandler(): void {
    if (this.form.invalid) {
      return;
    }

    this.userList.push({...this.form.value});
    this.topOfficialsList.emit(this.userList);
    if (this.myForm) {
      this.myForm.resetForm();
    }
  }

  /** Проверика на правило ввода в input */
  checkRule(control: string, flag: string): void {
    if (flag === 'onlyRus') {
      this.form.patchValue({
        [control]: this.form.value[control].replace(/[^А-Яа-яЁё ]/g, '')
      });
    }
    if (flag === 'charNum') {
      this.form.patchValue({
        [control]: this.form.value[control].replace(/[^А-Яа-яЁёA-Za-z\d ]/g, '')
      });
    }
    if (flag === 'rusNum') {
      this.form.patchValue({
        [control]: this.form.value[control].replace(/[^А-Яа-яЁё\d ]/g, '')
      });
    }
  }
  /**
   * Эмитит изменения формы во внешнюю форме, где данные обрабатываются и пишутся в историю.
   */
  setHistory(): void {
    if (this.idbHistory) {
      this.formPatcher(this.idbHistory);
    }
    if (this.idbHistoryUserList) {
      this.userList = this.idbHistoryUserList;
    }
    this.form.valueChanges.subscribe(res => {
      this.formSubscriber.emit(res);
    });
  }
  formPatcher(data): void {
    this.form.patchValue({
      ...data
    });
  }

  getErrorMessage(formControlName): string {
    if (this.form.controls[formControlName].hasError('required')) {
      return 'Обязательное поле';
    }
    if (this.form.controls[formControlName].hasError('email')) {
      return 'Введите email';
    }
    if (this.form.controls[formControlName].hasError('minlength')) {
      return `${this.form.controls[formControlName].errors.minlength.actualLength} / ${this.form.controls[formControlName].errors.minlength.requiredLength}`;
    }
  }

  editUser(idx: number): void {
    this.form.patchValue({
      ...this.userList[idx]
    });
    this.userList.splice(idx, 1);
    this.topOfficialsList.emit(this.userList);
  }
}
