import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-ui-step-progress',
  templateUrl: 'step-progress.component.html',
  styleUrls: ['step-progress.component.scss']
})

export class StepProgressComponent implements OnInit{
@Input() chain = [
    {condition: 'done'},
    {condition: 'done'},
    {condition: 'done'},
    {condition: 'poor'},
    {condition: 'poor'},
    {condition: 'poor'},
    {condition: 'poor'},
  ];
@Input() title = 'Экспертиза';

  steps: any = 0;
  constructor() { }
  ngOnInit(): void {
    this.steps = this.chain.reduce<number>(
      (accum, item) => {
      accum += item.condition === 'done' ? 1 : 0;
      return accum;
    }, 0);
  }
}
