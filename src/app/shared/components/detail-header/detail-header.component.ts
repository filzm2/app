import {Component, Output, EventEmitter} from '@angular/core';
import {HeaderService} from '../../../core/services/templateParts/header.service';

/**
 * Глупый компонент.
 * Вся логика вычисления проходят в headerService.
 * Свзяан с компонентом статус-градусника (который тоже глупый и вся логика которого содержится в собственном сервисе).
 * Для использования не надо ничего передавать напрямую.
 * Данные передаются сюда через headerService.setHeaderParams(params: IHeaderParams, data?: IHeaderData) в подписках,
 * которые располагаются в компонентах-пользователях в ngOnInit()...
 * В params передаются общие настройки, в data - данные для отображения
 * Не помещать в AfterViewInit и следующие шаги чтобы избежать ExpressionChangedAfterItHasBeenCheckedError
 * Пример исаользования в src/app/modules/dashboard/pages/orders/order-entity.form/order-entity.component.ts
 *
 * Как использовать:
 * 1. Создать настройки(какие есть настройки можно увидеть в интерфейсе IHeaderParams)
 *     const headerParams: IHeaderParams = {};
 * 2. Передать в метод headerService.setHeaderParams(params: IHeaderParams, data?: IHeaderData)
 */
@Component({
  selector: 'app-detail-header',
  templateUrl: './detail-header.component.html',
  styleUrls: ['./detail-header.component.scss']
})
export class DetailHeaderComponent {
  valueSearch = '';
  @Output() clickCreate = new EventEmitter();
  @Output() clickSearch = new EventEmitter();

  // кнопки в формах создания и просмотра заявки
  @Output() sendOrder = new EventEmitter();
  @Output() closeOrder = new EventEmitter();
  @Output() editOrder = new EventEmitter();

  constructor(public headerService: HeaderService) {
  }

  create(): void {
    this.clickCreate.emit();
  }

  search(): void {
    if (this.valueSearch) {
      this.clickSearch.emit(this.valueSearch);
    }
  }

}
