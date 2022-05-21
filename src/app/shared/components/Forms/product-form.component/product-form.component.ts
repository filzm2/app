import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import { TasksService } from '../../../../core/services/tasks.service';
import { IAppointment, IProductType } from '../../../../core/interfaces/task.type';
import {concatMap, takeUntil, tap} from 'rxjs/operators';
import { IOrder } from '../../../../core/interfaces/order.model';
import { OrderService } from '../../../../core/services/order.service';
import { createClientEntity, IClientEntity } from '../../../../core/interfaces/client-entity.model';

@Component({
  selector: 'app-form-product',
  templateUrl: 'product-form.component.html',
  styleUrls: ['product-form.component.scss']
})

export class ProductFormComponent implements OnInit, OnDestroy {
  @Input() idbHistory: any = null;
  @Input() orderId: number = null;
  @Output() formSubscriber: EventEmitter<any> = new EventEmitter<any>();
  @Output() sublimitData: EventEmitter<any> = new EventEmitter<any>();
  public appointmentList: Array<IAppointment> = [];
  public productTypes: Array<IProductType> = [];

  form: FormGroup;

  @Input() borrowers: IClientEntity[] = [];
  borrowersForTable: IClientEntity[] = [];

  selectedBorrowers = [];

  isShowAddBorrows = true;

  currentBorrower: IClientEntity = createClientEntity();

  accordionList: any;
  @ViewChild('accordion', {static: true}) Accordion: MatAccordion;
  @ViewChild(FormGroupDirective) myForm;
  flat = true;

  private unsubscribe$ = new Subject();

  constructor(
    private tasksService: TasksService,
    private orderService: OrderService,
    private ref: ChangeDetectorRef
  ) {
    this.accordionList = [];
    this.form = new FormGroup({
      product_type: new FormControl('', [Validators.required]),
      appointment: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      period: new FormControl('', [Validators.required]),
      transh_period: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      transhUnit: new FormControl('', [Validators.required]),
      note: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    // this.orderService.getOrder(this.orderId)
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe(
    //     (order: IOrder) => {
    //       if (order.companyGroup) {
    //         this.borrowersForTable = [...order.companyGroup.clientEntities];
    //         this.borrowers = [...order.companyGroup.clientEntities];
    //
    //       } else {
    //         this.borrowers = [];
    //         this.ref.detectChanges();
    //       }
    //     }
    //   );
    // this.setHistory();
    this.tasksService.getAppointments().pipe(
      tap(appointments => this.appointmentList = appointments),
      concatMap(res => {
        return this.tasksService.getProductTypes().pipe(
          tap(productTypes => this.productTypes = productTypes)
        );
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe();
    this.ref.detectChanges();
  }

  getPproductTitle(id: string): string {
    let product: IProductType;
    if(this.productTypes.length === 0) { return; }
    this.productTypes.forEach((item, i) => {
      if (item.id === +id) {
        product = item;
      }
    });
    return product ? product.name : '';
  }

  beforePanelClosed(panel): void {
    panel.isExpanded = false;
  }

  beforePanelOpened(panel): void {
    panel.isExpanded = true;
  }

  afterPanelClosed(tmp): void {
  }

  afterPanelOpened(tmp): void {
  }


  closeAllPanels(): void {
    this.Accordion.closeAll();
  }

  openAllPanels(): void {
    this.Accordion.openAll();
  }

  submitHandler(): void {
    if (this.form.invalid) {
      return;
    }
    this.accordionList.push({...this.form.value, borrowers: this.selectedBorrowers.slice(0)});
    if (this.selectedBorrowers.length) {
      this.selectedBorrowers.forEach((v, i) => {
        this.borrowers.push(v);
      });
    }
    this.selectedBorrowers = [];
    this.currentBorrower = createClientEntity();
    this.isShowAddBorrows = true;
    if (this.myForm) {
      this.myForm.resetForm();
    }
    this.sublimitData.emit(this.accordionList);
  }

  itemClick(some): void {
    console.log('event is:', some);
  }

  showAddBorrow(idx: number): boolean {
    const answer = false;
    if (idx === this.selectedBorrowers.length - 1 && this.borrowers.length) {
      return true;
    }
  }

  addBorrower($event): void {
    this.borrowers.forEach((item, idx) => {
      if (item.id === $event.value.id) {
        this.selectedBorrowers.push(item);
        this.borrowers.splice(idx, 1);
      }
    });
    this.currentBorrower = createClientEntity();
    this.isShowAddBorrows = false;
  }

  deleteBorrower(idx: number, item: IClientEntity): void {
    this.selectedBorrowers.splice(idx, 1);
    this.borrowers.push(item);
    if (!this.selectedBorrowers.length) {
      this.isShowAddBorrows = true;
    }
  }

  deleteItemProduct(idx: number): void {
    this.accordionList.splice(idx, 1);
  }

  clearItemBorrower(idx: number, bIdx: number): void {
    this.accordionList[idx].borrowers.splice(bIdx, 1);
  }

  getBorrowersListForTable(idx: number, borrower: any, borrowers: any): any {
    const tempArrayBorrowers = [...this.borrowersForTable];
    borrowers.forEach((v, i) => {
      tempArrayBorrowers.forEach((item, ii) => {
        if (item === v && item !== borrower) {
          tempArrayBorrowers.splice(ii, 1);
        }
      });
    });
    return tempArrayBorrowers;
  }

  changeBorrowerInTable(event: any, idx: number, bIdx: number): void {
    this.accordionList[idx].borrowers[bIdx] = event.value;
  }

  getNewBorrowersListForTable(idx: number, borrowers?: any): any {
    const tempArrayBorrowers = [...this.borrowersForTable];
    borrowers.forEach((v, i) => {
      tempArrayBorrowers.forEach((item, ii) => {
        if (item === v) {
          tempArrayBorrowers.splice(ii, 1);
        }
      });
    });
    return tempArrayBorrowers;
  }

  addBorrowerToTable(event: any, idx: number): void {
    this.accordionList[idx].borrowers.push(event.value);
  }

  /**
   * Эмитит изменения формы во внешнюю форму, где данные обрабатываются и пишутся в историю.
   */
  setHistory(): void {
    if(this.idbHistory) {
      this.formPatcher(this.idbHistory);
      for (let i = 0; i < this.borrowers.length; i++) {
        // TODO поправить убрать магик 11 когда серв отдаст нормально все (прикрепит клиента к заявке)
        const client_id =  11;
        this.accordionList.push({...this.borrowers[i], borrowers: [{client_id}]});
      }
    }
    this.form.valueChanges.subscribe(form => {
      if (form) {
        this.formSubscriber.emit(form);
      }
    });
  }
  formPatcher(data): void {
    this.form.patchValue({
      ...data
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
