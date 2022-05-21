import {Component} from '@angular/core';
import {StatusStepperService} from '../../../core/services/templateParts/status-stepper.service';
import {Subscription} from 'rxjs';
import {IProgressStepperStep} from '../../../core/interfaces/task.type';

/**
 * Компонент-градусник для отображения статуса заявки. Глупый чистый компонент, ничего не делает, только отображает.
 * 1. Имеющиеся статусы:
 * active(активный в этот момент, светло-голубой),
 * idle(существующий, но еще нетронутый, серый),
 * completed(законченный, зеленый),
 * pending(в процессе выполнения, светло-желтый),
 * cancelled(отмененный, не прошедший проверку, розовый),
 * error(завершидся с ошибкой, бардовый),
 * unknown(неизвестный, черный).
 * 2. Для изменения статуса заявки вызвать this.statusStepperService.shangeStatusStepper и передать заявку.
 * В данный момент обрабатывает всё, что есть в заявке и рисует компонент. Если нужно что-то изменить, то менять в сервисе.
 * Вся грязь деалется в StatusStepperService.statusSetterMediator.
 */
@Component({
  selector: 'app-status-stepper',
  templateUrl: './status-stepper.component.html',
  styleUrls: ['./status-stepper.component.scss']
})
export class StatusStepperComponent {
  public progressStepper: IProgressStepperStep[];
  public statusStepperSub: Subscription;

  constructor(
    private statusStepperService: StatusStepperService,
  ) {
    this.statusStepperSub = this.statusStepperService.statusStepper$.subscribe(next => {
      this.progressStepper = next;
    });
  }
}
