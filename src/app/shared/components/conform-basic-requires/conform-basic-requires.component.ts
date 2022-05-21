import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-conform-basic-requires',
  templateUrl: './conform-basic-requires.component.html',
  styleUrls: ['./conform-basic-requires.component.scss']
})
export class ConformBasicRequiresComponent implements OnInit {
  displayedColumns: string[] = ['num', 'title', 'val', 'conformity'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface PeriodicElement {
  num: number;
  title: string;
  val: number;
  conformity: boolean;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {num: 1, title: 'EBIT / Проценты к уплате', val: 700, conformity: true},
  {num: 2, title: 'Краткосрочный долг - нетто / EBITDA', val: 600, conformity: false},
  {num: 3, title: '(Долгосрочный долг  / Дюрация долгосрочного долга + Краткосрочный долг-нетто ) / EBITDA', val: 200, conformity: true},
  {num: 4, title: '(Долгосрочный долг  / Дюрация долгосрочного долга + Краткосрочный долг-нетто ) / Выручка', val: 500, conformity: false},
  {num: 5, title: 'Собственный капитал / Всего активы', val: 432, conformity: true},
  {num: 6, title: 'Остаток поступлений средств по  действующим контрактам / (Долгосрочный долг  + Краткосрочный долг-нетто ) ', val: 777, conformity: true},
  {num: 7, title: 'FCCF / (Долгосрочный долг  + Краткосрочный долг) ', val: 685, conformity: true},
  {num: 8, title: 'Наличие дефицита денежных средств в любом из периодов (помесячно или поквартально) прогнозного CF, не имеющего подтвержденных источников покрытия', val: 425, conformity: true},
  {num: 9, title: 'Доля крупнейшего лизингополучателя', val: 430, conformity: true},
  {num: 10, title: 'Доля просроченной задолженности в лизинговом портфеле', val: 480, conformity: false},
  {num: 11, title: 'Плановый RAROC по Клиенту', val: 725, conformity: true},
  {num: 12, title: 'Консолидация отчетности', val: 306, conformity: true},
  {num: 13, title: 'Лояльность и открытость Банку', val: 1000, conformity: true},
  {num: 14, title: 'Качество менеджмента', val: 200, conformity: true},
  {num: 15, title: 'Цель кредитования', val: 188, conformity: true},
  {num: 16, title: 'Источники погашения', val: 10, conformity: true},
  {num: 17, title: 'Обеспеченность', val: 1260, conformity: true},
  {num: 18, title: 'Поручительства основных компаний Группы', val: 920, conformity: false},
  {num: 19, title: 'Поручительство собственников', val: 666, conformity: true},
  {num: 20, title: 'Оформление обеспечительных договоров и проведение юридических экспертиз', val: 28, conformity: true},
  {num: 21, title: 'Информацию о некредитуемых Банком Клиентах см. пункт 7.1. "Положениео принципах кредитования корпоративных клиентов"', val: 562, conformity: true},
  {num: 22, title: 'Вывод о соответствии базовым требованиям', val: 777, conformity: true},
];
