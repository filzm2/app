import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-primary-checks-status',
  templateUrl: './primary-checks-status.component.html',
  styleUrls: ['./primary-checks-status.component.scss']
})
export class PrimaryChecksStatusComponent implements OnInit {
  @Input() checkStatuses: any[] = [
    {
      id: 2,
      caption: 'Проверка на СТОП–факторы',
      description: 'С другой стороны сложившаяся структура организации позволяет выполнять важные задания по разработке\n' +
        '                  направлений прогрессивного развития.Разнообразный и богатый опыт дальнейшее развитие различных форм деятельности позволяет оценить' +
        'значение форм развития. Разнообразный и богатый опыт дальнейшее развитие различных форм деятельности позволяет оценить значение форм развития.',
      types: [
        {
          status: 'success',
          caption: 'Пройдена успешно'
        },
        {
          status: 'alerted',
          caption: 'Требуются ручные проверки'
        },
        {
          status: 'denied',
          caption: 'Выявлены СТОП-факторы'
        }
      ]
    }
  ];
  constructor() { }
  ngOnInit(): void {
  }

}
