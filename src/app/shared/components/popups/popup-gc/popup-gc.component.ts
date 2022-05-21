import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BehaviorSubject, EMPTY, Observable} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap} from 'rxjs/operators';
import {MockService} from '../../../../core/mock/mock.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ICompany} from '../../../../core/mock/interfaces.type';
import {TasksService} from '../../../../core/services/tasks.service';
import {OrderService} from '../../../../core/services/order.service';
import {Router} from '@angular/router';
import { createClientEntity, IClientEntity } from '../../../../core/interfaces/client-entity.model';

@Component({
  selector: 'app-popup-gc',
  templateUrl: './popup-gc.component.html',
  styleUrls: ['./popup-gc.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopupGcComponent implements OnInit {
  public modalSteps: Array<any> = [
    {condition: true, title: 'Поиск компании'},
    {condition: false, title: 'Добавление компании'},
  ];
  public myControl = new FormControl();
  public options = new BehaviorSubject<any>([]);
  public filteredOptions: Observable<any>;
  public isSearchResultExist = false;
  public allSelectedCompaniesWithSearchResult: any[] = [];
  public searchResult: any | any[] = [];
  public actualOptionId: any = null;
  constructor(
    public mockService: MockService,
    private tasksService: TasksService,
    private orderService: OrderService,
    private router: Router,
    private dialogRef: MatDialogRef<PopupGcComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any | Array<any>) {
  }
  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        filter(el => {
          return el.trim();
        }),
        tap(s => {
          console.log('changes is:', s);
          this.orderService.currentClientName = s;
          return s;
        }),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(v =>
          this.orderService.getClients(v)
            .pipe(
              map( (clients: any) => {
                clients = clients.filter( item => item.clientEntities.length && !item.gkId);
                return clients;
              }),
              tap(clients => {
                this.options.next(clients);
              }),
              map((value: any) => {
                return this._filter(value);
              }),
              tap( (clients: []) => {
                this.data.isAddToNewGK ? this.isSearchResultExist = this.data.isAddToNewGK : this.isSearchResultExist = !!clients.length;
              }),
              catchError( err => EMPTY)
            )
        ),
      );
  }
  private _filter(value: any): any[] {
    this.searchResult = [];
    const companyClient = value.map(item => item.clientEntities[0]);
    this.searchResult = companyClient;
    // remove added companies
    if (this.data.testCompanies.length > 0) {
      const filteredFromParentComponent = this.searchResult.filter( company => {
        const isCompanyalreadySelected = this.data.testCompanies.map((alreadySelectedCompany) => {
          return company.id === alreadySelectedCompany.id;
        });
        return !isCompanyalreadySelected.includes(true);
      });
      this.searchResult = filteredFromParentComponent;
    }
    return this.searchResult;
  }
  public completeTask(): void {
    if (this.searchResult.length) {
      const companyWeNeedToAdd = this.searchResult.filter((company) => {
        return company.id === this.actualOptionId;
      });
      this.allSelectedCompaniesWithSearchResult = [...this.data.testCompanies,  ...companyWeNeedToAdd];
      console.log('this.allSelectedCompaniesWithSearchResult', this.allSelectedCompaniesWithSearchResult);
      this.mockService.selectedCompaniesInGCForm$.next(this.allSelectedCompaniesWithSearchResult);
    } else {
      const newCompany: IClientEntity = createClientEntity();
      newCompany.title = this.myControl.value;
      console.log('newCompany', newCompany);
      this.allSelectedCompaniesWithSearchResult = [...this.data.testCompanies, ...[newCompany]];
      console.log('this.allSelectedCompaniesWithSearchResult', this.allSelectedCompaniesWithSearchResult);
      this.mockService.selectedCompaniesInGCForm$.next(this.allSelectedCompaniesWithSearchResult);
    }
  }
  public onChangeInput(): void {
    if (this.myControl.value && this.myControl.value.length === 0) {
      this.searchResult = null;
    }
  }
  public changePopupStatus(actualId): void {
    this.actualOptionId = actualId;
    this.modalSteps[1].condition = true;
  }

  createNewClient($event: any): void {
    if (this.data.currentReqId) {
      this.router.navigate([`dashboard/client/entity`, this.data.currentReqId,  this.data.currentTaskId], {queryParams: {group: this.data.currentGroupCompany}});
      this.dialogRef.close();
    } else {
      alert('Нет выбранной группы компаний');
    }
  }
}
