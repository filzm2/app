import {Component, Input, OnInit} from '@angular/core';
@Component({
  selector: 'app-construction',
  templateUrl: 'construction.component.html',
  styleUrls: ['construction.component.scss'],
})


export class ConstructionComponent implements OnInit{
@Input() itemData = {test: 'Не проверен'};

  data = {
      status: {
        title: 'Не проверен',
        text: 'Реестр уполномоченного органа',
      },
      user: {
        title: 'Комментарий',
        text: 'Какой то комментарий от клиента по поводу документа',
      },
      bank: {
        title: 'Комментарий',
        text: 'Какой то комментарий от банка для клиента',
      }
  };

  ngOnInit(): void {
    this.data.status.title = this.itemData.test;
  }

}
