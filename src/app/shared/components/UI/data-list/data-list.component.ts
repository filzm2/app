import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-ui-data-list',
  templateUrl: 'data-list.component.html',
  styleUrls: ['data-list.component.scss']
})

export class DataListComponent {
 @Input() userList = [
   {
     fullName: 'Жмыщенко Валерий Альбертович',
     address: 'г. Москва, ул. Комсомольская, д.71',
     document: 'Паспорт РФ 9219 495245',
     documentType: 'passport',
     bornPlace: 'с. Жамбыл, Казахстан',
     birthday: '12.08.1988',
     function: 'Бухгалтер',
   }, {
     fullName: 'Ефимов Семен Вениаминович',
     address: 'г. Комсомольск, ул. Московская, д.71',
     document: 'Паспорт РФ 9219 495245',
     documentType: 'passport',
     bornPlace: 'с. Мааскантье, Голандия',
     birthday: '12.08.1988',
     function: 'Кутила',
   },
 ];

  badgeDeleteHandler(key): void {
    this.userList = this.userList.filter( item => item.fullName !== key);
    console.log('delete handler');
  }
}
