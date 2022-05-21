import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {concatMap, takeUntil, tap} from 'rxjs/operators';
import {IOrder} from '../../../../core/interfaces/order.model';
import {OrderService} from '../../../../core/services/order.service';
import {IClientEntity} from '../../../../core/interfaces/client-entity.model';
import {Subject, Subscription} from 'rxjs';
import {IAppointment, IProductType} from '../../../../core/interfaces/task.type';
import {TasksService} from '../../../../core/services/tasks.service';

@Component({
  selector: 'app-form-product-entity',
  templateUrl: 'product-form-entity.component.html',
  styleUrls: ['product-form-entity.component.scss']
})

export class ProductFormEntityComponent implements OnInit, OnDestroy{
  @Input() orderId: number = null;
  @Input() idbHistory: any = null;
  @Output() sublimitData: EventEmitter<any> = new EventEmitter<any>();
  @Output() formSubscriber: EventEmitter<any> = new EventEmitter<any>();
  private unsubscribe$ = new Subject();
  public appointmentList: Array<IAppointment> = [];
  public productTypes: Array<IProductType> = [];
  public currentEntity: any = null;
  form: FormGroup;

  @Input() currentBorrower: IClientEntity;

  public accordionList: any = [];
  @ViewChild('accordion', {static: true}) Accordion: MatAccordion;
  @ViewChild(FormGroupDirective) myForm;
  @Input() borrowers: IClientEntity[];
  flat = true;

  constructor(
    private orderService: OrderService,
    private tasksService: TasksService,
    private ref: ChangeDetectorRef
  ) {
    this.form = new FormGroup({
      product_type: new FormControl('', [ Validators.required]),
      appointment: new FormControl('', [ Validators.required]),
      amount: new FormControl('', [ Validators.required, Validators.pattern('^[0-9]*$')]),
      period: new FormControl('', [ Validators.required]),
      transh_period: new FormControl('', [ Validators.required, Validators.pattern('^[0-9]*$')]),
      transhUnit: new FormControl('', [ Validators.required]),
      note: new FormControl('', [ Validators.required]),
    });
  }

  ngOnInit(): void {
    this.orderService.getOrder(this.orderId)
      .pipe(
        takeUntil(this.unsubscribe$))
      .subscribe(
        (order: IOrder) => {
          this.currentEntity = order.clientEntity;
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
      );
    this.setHistory();
  }

  /**
   * Эмитит изменения формы во внешнюю форме, где данные обрабатываются и пишутся в историю.
   */
  setHistory(): void {
    if(this.idbHistory) {
      this.formPatcher(this.idbHistory);
      for (let i = 0; i < this.borrowers.length; i++) {
        // TODO поправить убрать магик 11 когда серв отдаст нормально все (прикрепит клиента к заявке)
        const client_id_ = this.currentEntity ? this.currentEntity.id : 11;
        this.accordionList.push({...this.borrowers[i], borrowers: [{client_id: client_id_}]});
      }
    }
    this.form.valueChanges.subscribe(form => {
      if (form) {
        this.formSubscriber.emit(form);
      }
    });
  }

  beforePanelClosed(panel): void{
    panel.isExpanded = false;
  }
  beforePanelOpened(panel): void{
    panel.isExpanded = true;
  }

  afterPanelClosed(tmp): void{}
  afterPanelOpened(tmp): void{}

  closeAllPanels(): void{
    this.Accordion.closeAll();
  }
  openAllPanels(): void{
    this.Accordion.openAll();
  }

  submitHandler(): void {
    if (this.form.invalid) {
      return;
    }

    // TODO поправить убрать магик 11 когда серв отдаст нормально все (прикрепит клиента к заявке)
    const client_id_ = this.currentEntity ? this.currentEntity.id : 11;
    this.accordionList.push({...this.form.value, borrowers: [{client_id: client_id_}]});
    console.log({...this.form.value, id: Date.now()});
    if (this.myForm) {
      this.myForm.resetForm();
    }
    this.sublimitData.emit(this.accordionList);
  }

  itemClick(some): void {
    console.log('event is:', some);
  }

  deleteItemProduct(id): void {
    this.accordionList = this.accordionList.filter((item, idx) =>  item.id !== id);
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
  getAppointmentTitle(id: string): string {
    let appointment: any = {};
    if(this.appointmentList.length === 0) { return; }
    this.appointmentList.forEach((item, i) => {
      if (item.id === +id) {
        appointment = item;
      }
    });
    if(!appointment || !appointment.name) return;
    return appointment.name;
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
