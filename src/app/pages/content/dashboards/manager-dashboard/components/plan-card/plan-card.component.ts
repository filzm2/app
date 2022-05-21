import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';

export interface IPlanSettings {
  plan: any;
  fact: any;
  quarterPlan: Array<any>;
  quarterFact: Array<any>;
  efficiency: number;
  name: string;
  unit: string;
}

@Component({
  selector: 'app-plan-card',
  templateUrl: './plan-card.component.html',
  styleUrls: ['./plan-card.component.scss']
})
export class PlanCardComponent implements OnInit, OnChanges {

  public plan: any;
  public fact: any;
  public top: number;
  public efficiency: number;
  public title: string;
  public subTitle: string;
  public color: 'green' | 'red' | 'yellow' | 'grey';
  public percent: number;
  public topText: string;
  public endOfPeriod: boolean = false;
  public avg: boolean = false;

  public showIndicator: boolean = true;

  public inverseNames = [
    'Операционные расходы',
    'CIR',
    'Staff CIR',
    'CoR'
  ];

  public endOfPeriodNames = [
    'Активы',
    'Пассивы',
    'RWA',
    'Капитал',
    'CSI'
  ];


  @Output() public select: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() public active: boolean;
  @Input() public onlyRed: boolean;
  @Input() set settings(set: IPlanSettings) {
    // this.top = set.top;
    this.title = set.name;
    this.subTitle = set.unit;
    if (set?.quarterFact) {
      this.plan = set.quarterPlan[3];
      this.fact = set.quarterFact[3];
    } else {
      this.plan = set.plan;
      this.fact = set.fact;
    }
    // if (set.unit === '%') {
    //   this.plan = set.plan/4;
    //   this.fact = set.fact/4;
    // } else {
    //   this.plan = set.plan;
    //   this.fact = set.fact;
    // }
    if (this.inverseNames.includes(set.name)) {
      this.percent = Math.round(this.divideIfNotZero(this.plan, this.fact) * 100);
    } else if (this.fact && this.plan) {
      this.percent = Math.round(this.divideIfNotZero(this.fact, this.plan) * 100);
    }
    if (this.endOfPeriodNames.includes(set.name)) {
      this.endOfPeriod = true;
    }
    if (this.percent >= 100) {
      this.color = 'green';
    } else if (this.percent < 100 && this.percent >= 80) {
      this.color = 'yellow';
    } else if (this.percent < 80) {
      this.color = 'red';
    } else if (!this.percent) {
      this.color = 'grey';
    }
    // this.topText = this.top < 10 ?
    //   'В ТОП-10' : this.top < 20 ?
    //     'В ТОП-20' : this.top < 100 ?
    //       'В ТОП-100' : 'В ТОП-1000';
  }


  constructor() {

  }

  ngOnInit(): void {
    if (this.onlyRed && this.color === 'red' && this.plan) {
      this.showIndicator = true;
    } else if (this.onlyRed) {
      this.showIndicator = false;
    } else if (!this.onlyRed) {
      this.showIndicator = true;
    }
  }

  ngOnChanges() {
    if (this.onlyRed && this.color === 'red' && this.plan) {
      this.showIndicator = true;
    } else if (this.onlyRed) {
      this.showIndicator = false;
    } else if (!this.onlyRed) {
      this.showIndicator = true;
    }
  }

  cardClick(title) {
    this.active = !this.active;
    this.select.emit(title);
  }

  divideIfNotZero(numerator, denominator) {
    if (denominator === 0 || isNaN(denominator) || !denominator) {
          return null;
    }
    else {
          return numerator / denominator;
    }
  }
}
