import {
  ChangeDetectorRef,
  Component,
  Input, OnDestroy,
  OnInit
} from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { IOrder } from '../../../core/interfaces/order.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TasksService } from '../../../core/services/tasks.service';
import { ITask } from '../../../core/interfaces/task.model';
import {IClientEntity, IDataForInfo} from '../../../core/interfaces/client-entity.model';
import {ICompanyGroup} from '../../../core/interfaces/company-group.model';

/**
 * Может принимать в себя заявку, ид заявки или ид таска.
 * Компании берутся из заявки. Чем ближе к заявке передаваемая сущность, тем меньше делается запросов.
 */
@Component({
  selector: 'app-about-company',
  templateUrl: './about-company.component.html',
  styleUrls: ['./about-company.component.scss']
})
export class AboutCompanyComponent implements OnInit, OnDestroy {

  orderId: number = null;
  @Input() data: IDataForInfo = null;
  @Input() taskId: number = null;
  @Input() requestId: number = null;
  @Input() order: IOrder;

  companyData = {
    gk: false,
    company: null
  };
  clientEntity: any;
  showClientEntity = false;

  private unsubscribe$ = new Subject();

  constructor(
    private orderService: OrderService,
    private ref: ChangeDetectorRef,
    private taskService: TasksService) {
  }

  ngOnInit(): void {
    if (this.data) {
      this.showCorrectData(this.data);
    }
    if (this.taskId) {
      this.taskService.getTask(this.taskId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (task: ITask) => {
            if (task.request_id) {
              this.orderId = task.request_id;
              this.getOrder(this.orderId);
            }
          }
        );
    }
    if (this.requestId) {
      this.getOrder(this.requestId);
    }
  }
  public getOrder(orderID): void {
    this.orderService.getOrder(orderID)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (order: IOrder) => {
          this.showCorrectData(order);
        }
      );
  }
  public showCorrectData(data: any): void {
    if ( data.type && data.type === 'entity' ) {
      this.taskService.getClientCompanyById(data.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((client: IClientEntity) => {
          this.clientEntity = client;
          this.showClientEntity = true;
          console.log('Company: ', this.clientEntity);
      });
    } else if ( data.type && data.type === 'gk' ) {
      this.taskService.getGroupCompanyById(data.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((company: ICompanyGroup) => {
          this.companyData = { gk: true, company };
          console.log('Company Group Data: ', this.companyData);
        });
    }
    this.ref.detectChanges();
  }

  showClient(client?: any): void {
    this.companyData.gk = false;
    this.showClientEntity = true;
    if (client) {
      this.clientEntity = client;
    }
  }

  closeClientEntity(): void {
    this.companyData.gk = true;
    this.showClientEntity = false;
    this.clientEntity = null;
  }

  isShowClientEntity(): boolean {
    if (this.showClientEntity || (this.companyData.gk && this.companyData.company.companyGroup.companies <= 1)) {
      return true;
    }

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
