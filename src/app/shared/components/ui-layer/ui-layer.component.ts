import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {StatusStepperService} from '../../../core/services/templateParts/status-stepper.service';
import {MockService} from '../../../core/mock/mock.service';
import {PopupDocChatComponent} from '../../../modules/dashboard/pages/tasks/min-doc-pac.component/popup-doc-chat/popup-doc-chat.component';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import {HeaderService, IHeaderParams} from '../../../core/services/templateParts/header.service';
import {IUserpick} from '../../../core/interfaces/userpick.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';

interface PostElement {
  title: string;
  code: number;
  date01: string;
  date02: string;
  date03: string;
  date04: string;
}

const ELEMENT_DATA: PostElement[] = [
  {title: 'Статья 1', code: 3252235, date01: '1 289 983 399 ₽', date02: '1 289 983 399 ₽', date03: '1 289 983 399 ₽', date04: '1 289 983 399 ₽'},
  {title: 'Статья 2', code: 2562466, date01: '1 289 983 399 ₽', date02: '1 289 983 399 ₽', date03: '1 289 983 399 ₽', date04: '1 289 983 399 ₽'},
  {title: 'Статья 3', code: 6585688, date01: '1 289 983 399 ₽', date02: '1 289 983 399 ₽', date03: '1 289 983 399 ₽', date04: '1 289 983 399 ₽'},
  {title: 'Статья 4', code: 3463467, date01: '1 289 983 399 ₽', date02: '1 289 983 399 ₽', date03: '1 289 983 399 ₽', date04: '1 289 983 399 ₽'},
  {title: 'Статья 5', code: 2141254, date01: '1 289 983 399 ₽', date02: '1 289 983 399 ₽', date03: '1 289 983 399 ₽', date04: '1 289 983 399 ₽'},
  {title: 'Статья 6', code: 5336752, date01: '1 289 983 399 ₽', date02: '1 289 983 399 ₽', date03: '1 289 983 399 ₽', date04: '1 289 983 399 ₽'},
  {title: 'Статья 7', code: 9065567, date01: '1 289 983 399 ₽', date02: '1 289 983 399 ₽', date03: '1 289 983 399 ₽', date04: '1 289 983 399 ₽'},
  {title: 'Статья 8', code: 6643782, date01: '1 289 983 399 ₽', date02: '1 289 983 399 ₽', date03: '1 289 983 399 ₽', date04: '1 289 983 399 ₽'},
  {title: 'Статья 9', code: 8223463, date01: '1 289 983 399 ₽', date02: '1 289 983 399 ₽', date03: '1 289 983 399 ₽', date04: '1 289 983 399 ₽'},
  {title: 'Статья 10', code: 1124567, date01: '1 289 983 399 ₽', date02: '1 289 983 399 ₽', date03: '1 289 983 399 ₽', date04: '1 289 983 399 ₽'}
];

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA_SELECT: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-ui-layer',
  templateUrl: 'ui-layer.component.html',
  styleUrls: ['ui-layer.component.scss']
})
export class UiLayerComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  testForm: FormGroup;
  isSelectLoading = true;
  isSelectLoaded = false;
  isSelectLoadedError = false;
  subtitlesForSelect = [
    {val: 1, caption: 'Subtitle 1'},
    {val: 2, caption: 'Subtitle 2'},
    {val: 3, caption: 'Subtitle 3'},
    {val: 4, caption: 'Subtitle 4'},
    {val: 5, caption: 'Subtitle 5'},
    {val: 6, caption: 'Subtitle 6'}
  ];

  docSearchControl = new FormControl();

  currentFile: any = {name: 'тестовый файл.docx', size: '199'};

  dataForUserpick: IUserpick = {
    photo: 'https://passionforprying.files.wordpress.com/2017/09/maybelline-contour-mastercontourpalette-gigi-beauty-1x1.jpg',
    name: 'Константинопольская Анна Валерьевна',
    position: 'RM',
    department: 'Департамент сельскохозяйственной промышленности'
  };

  dataForUserpickSecond: IUserpick = {
    photo: 'https://passionforprying.files.wordpress.com/2017/09/maybelline-contour-mastercontourpalette-gigi-beauty-1x1.jpg',
    name: 'Константинопольская Анна Валерьевна',
    position: '',
    department: ''
  };

  displayedColumns: string[] = ['title', 'code', 'date01', 'date02', 'date03', 'date04'];
  dataSource: MatTableDataSource<PostElement>;

  displayedColumnsSelect: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  dataSourceSelect: MatTableDataSource<PeriodicElement>;
  selection = new SelectionModel<PeriodicElement>(true, []);

  // сindeterminate checkboxes
  allComplete = false;
  task: Task = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'Primary', completed: false, color: 'primary'},
      {name: 'Accent', completed: true, color: 'accent'},
      {name: 'Warn', completed: false, color: 'warn'}
    ]
  };

  constructor(
    public statusStepperService: StatusStepperService,
    public mockService: MockService,
    public matDialog: MatDialog,
    public fb: FormBuilder,
    protected cdr: ChangeDetectorRef,
    private headerService: HeaderService
  ) {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSourceSelect = new MatTableDataSource(ELEMENT_DATA_SELECT);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    // настройки хэдера
    const headerParams: IHeaderParams = {
      caption: 'Главный экран руководителя',
      showUser: false,
      showSearch: true,
      showCaption: true,
      showBackDoor: false,
      showAboutTask: false,
      showCreateBtn: false,
      showAboutRequest: false,
      showOrderStatus: false,
      userPosition: 'boss',
      numbers: [21, 132, 132],
      bossList: ['Центр по работе с региональной сетью']
    };
    this.headerService.setHeaderParams(headerParams);


    this.statusStepperService.shangeStatusStepper(this.mockService.getMockRequest());
    this.createTestForm();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceSelect.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSourceSelect.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  onClick(data: any): void {
    console.log('button clicked', data);
  }

  onChange(e): void {
    console.log('e: ', e);
  }

  // chat
  public openChat(): void {
    const dialogRef = this.matDialog.open(PopupDocChatComponent, {
      panelClass: 'custom-dialog-container',
      data: {somedata: 'helllo!'}
    });
    dialogRef.afterClosed().subscribe(el => {
    });
  }

  // /chat
  createTestForm(): void {
    this.testForm = this.fb.group({
      input76: [null, Validators.compose([Validators.required, Validators.email])],
      input64: [null, Validators.compose([Validators.required, Validators.email])],

      input76disabled: [{value: null, disabled: true}],
      input64disabled: [{value: null, disabled: true}],

      input76disabledFilled: [{value: 'Filled', disabled: true}, Validators.compose([])],
      input64disabledFilled: [{value: 'Filled', disabled: true}, Validators.compose([])],

      select76: [null, Validators.compose([Validators.required])],
      select64: [null, Validators.compose([Validators.required])],

      outline76: [null, Validators.compose([Validators.required])],
      outline76disabled: [{value: null, disabled: true}, Validators.compose([Validators.required])],
      outline76disabledFilled: [{value: 'Filled', disabled: true}, Validators.compose([Validators.required])],

      outline64: [null, Validators.compose([Validators.required])],
      outline64disabled: [{value: null, disabled: true}, Validators.compose([Validators.required])],
      outline64disabledFilled: [{value: 'Filled', disabled: true}, Validators.compose([Validators.required])],

      select76selectHeh: [null, Validators.compose([Validators.required])],
      checkboxReq: [null, Validators.compose([Validators.required, Validators.requiredTrue])],

      radioReq: [null, Validators.compose([Validators.required])],

      input76timePicker: [null]
    });
  }

  // обработчик для любых ошибок
  getErrorMessage(formControlName): string {
    if (this.testForm.controls[formControlName].hasError('required')) {
      return 'Обязательное поле';
    }
    if (this.testForm.controls[formControlName].hasError('email')) {
      return 'Введите email';
    }
    if (this.testForm.controls[formControlName].hasError('minlength')) {
      return `${this.testForm.controls[formControlName].errors.minlength.actualLength} / ${this.testForm.controls[formControlName].errors.minlength.requiredLength}`;
    }
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean): void {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => t.completed = completed);
  }

  getCheckBoxError(): boolean {
    if (this.testForm.touched) {
      const value = this.testForm.get('checkboxReq').invalid;
      return value;
    }
    return false;
  }

  onUploadFile($event: Event): void {
    console.log('event: ', $event);
  }

  public clearFileInput(): void {
    this.currentFile = null;
  }

}

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}
