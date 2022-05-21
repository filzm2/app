import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-appointed-expertises',
  templateUrl: './appointed-expertises.component.html',
  styleUrls: ['./appointed-expertises.component.scss']
})
export class AppointedExpertisesComponent implements OnInit {
  expertises = expertises;

  constructor() {
  }

  ngOnInit(): void {
  }

}

const expertises = [
  {caption: 'Юридическая', statusType: 1, status: 'Назначается', date: '12.05.2020'},
  {caption: 'Финансовая', statusType: 2, status: 'Верификация', date: '18.05.2020'},
  {caption: 'Финансовая', statusType: 3, status: 'Выполняется', date: '18.05.2020'},
  {caption: 'Проверка', statusType: 4, status: 'Принято в ДКР', date: '11.05.2020'},
];
