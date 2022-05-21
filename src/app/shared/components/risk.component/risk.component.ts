import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-risk',
  templateUrl: 'risk.component.html',
  styleUrls: ['risk.component.scss'],
})


export class RiskComponent implements OnInit{
 @Input() itemData = [];

 data = {
   type: 'Вопрос',
   date: '23.06.2020',
   text: 'Идейные соображения высшего порядка, а также постоянный количественный рост и сфера нашей активности требуют от нас анализа системы обучения кадров, соответствует насущным потребностям. Разнообразный и богатый опыт сложившаяся структура организации влечет за собой процесс внедрения и модернизации существенных финансовых и административных условий.',
   user: {
     role: 'Эксперт рисков',
     name: 'Александр Хмельной'
   }
 };

  ngOnInit(): void {
    this.data = {...this.data, ...this.itemData};
  }
}
