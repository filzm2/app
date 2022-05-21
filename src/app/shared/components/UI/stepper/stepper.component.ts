import {Component, Input} from '@angular/core';
@Component({
  selector: 'app-ui-stepper',
  templateUrl: 'stepper.component.html',
  styleUrls: ['stepper.component.scss']
})

export class StepperComponent {
  @Input() steps: any = [
    {condition: true, title: 'Поиск клиента'},
    {condition: true, title: 'Поиск патента'},
    {condition: false, title: 'Поиск абитуриента'},
    {condition: false, title: 'Поиск пегмента'},
    {condition: false, title: 'Поиск компонента'},
  ];
}
