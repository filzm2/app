import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {EMPTY, Observable} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap
} from 'rxjs/operators';
import {OrderService} from '../../../../core/services/order.service';
import {IClientEntity} from '../../../../core/interfaces/client-entity.model';

/**
 * @title Filter autocomplete
 */
@Component({
  selector: 'app-autocomplete',
  templateUrl: 'autocomplete.component.html',
  styleUrls: ['autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {
  @Input() set resetMyControl(reset) {
    if (reset.status) {
      this.myControl.reset();
      this.orderService.haveItems = false;
      this.orderService.clientList = [];
      this.filteredOptions$ = new Observable<any>();
    } else {
      this.setFilterObserv();
    }
  }
  @Output() selectedItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() activatedItems: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedItemId: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeValue: EventEmitter<any> = new EventEmitter<any>();

  myControl = new FormControl();
  filteredOptions$: Observable<any>;
  isEmptyList = null;

  constructor(
    private orderService: OrderService
  ) {
    this.setFilterObserv();
  }

  ngOnInit(): void {
    this.filteredOptions$.subscribe(res => {
      if (res.length) {
        this.activatedItems.emit(true);
        return;
      }
      this.activatedItems.emit(false);
    });
  }

  setFilterObserv(): void {
    this.filteredOptions$ = this.myControl.valueChanges
      .pipe(
        filter(el => {
          return el ? el.trim() : '';
        }),
        tap(s => {
          this.changeValue.emit(s);
          return s;
        }),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((v, i) =>
          this.orderService.getClients(v)
            .pipe(
              map( (clients: IClientEntity[]) => {
                const companies = [...clients];
                const gkForAutocomplete = [];
                const companiesForAutocomplete = [];
                companies.forEach((vv) => {
                  const tempCompany = {
                    type: 'entity',
                    id: vv.id,
                    title: vv.fullName ? vv.fullName : 'Нет названия',
                    specTitle: vv.fullName && (vv.fullName.toLowerCase()).includes(v.toLowerCase()) ? this.setBlueAndUsualText(vv.fullName) : null,
                    inn: vv.inn ? vv.inn : '',
                    specINN: vv.inn && vv.inn.indexOf(v) > -1 ? this.setBlueAndUsualText(vv.inn) : null,
                    kpp: vv.kpp ? vv.kpp : '',
                    specKPP: vv.kpp && vv.kpp.indexOf(v) > -1 ? this.setBlueAndUsualText(vv.kpp) : null,
                    opf: vv.opf
                  };
                  if (vv.companyGroup) {
                    if (!!gkForAutocomplete.filter( item => item.id === vv.companyGroup.id).length) {
                      gkForAutocomplete.forEach((gk) => {
                        if (gk.id === vv.companyGroup.id) {
                          if ( !!tempCompany.specTitle || !!tempCompany.specINN || !!tempCompany.specKPP ) {
                            gk.companies.push(tempCompany);
                          }
                        }
                      });
                    } else {
                      const tempGK = {
                        id: vv.companyGroup.id,
                        title: vv.companyGroup.groupName,
                        specTitle: (vv.companyGroup.groupName.toLowerCase()).includes(v.toLowerCase()) ? this.setBlueAndUsualText(vv.companyGroup.groupName) : null,
                        type: 'gk',
                        companies: []
                      };
                      if ( !!tempCompany.specTitle || !!tempCompany.specINN || !!tempCompany.specKPP ) {
                        tempGK.companies.push(tempCompany);
                      }
                      gkForAutocomplete.push(tempGK);
                    }
                  } else {
                    companiesForAutocomplete.push(tempCompany);
                  }
                });
                this.orderService.clientList = [...gkForAutocomplete, ...companiesForAutocomplete];
                return this.orderService.clientList;
              }),
              tap( (clients: []) => {
                this.isEmptyList = !clients.length;
              }),
              catchError( err => EMPTY)
            )
        ),
      );
  }

  selectedOption(): void {
    this.selectedItem.emit(this.myControl.value);
  }

  setItemId(id: string): void {
    const choosenCompany = this.orderService.clientList.filter(client => client.id === id)[0];
    this.selectedItemId.emit(choosenCompany);
  }

  /**
   * Разбивает строку на синие и обычные части.
   * @param val val
   */
  setBlueAndUsualText(val: string): any {
    if (!val) { return; }

    const spl = val.toLowerCase().match(this.myControl.value.toLowerCase()).index;

    const part1 = val.substr(0, spl); // usual
    const part2 = val.substr(spl, this.myControl.value.length); // blue
    const part3 = val.substr(part1.length + part2.length, val.length - 1); // usual

    const returnArr = [
      {type: 'default', val: part1, bold: false},
      {type: 'blue', val: part2, bold: true},
      {type: 'default', val: part3, bold: false}
    ];
    return returnArr;
  }
}
