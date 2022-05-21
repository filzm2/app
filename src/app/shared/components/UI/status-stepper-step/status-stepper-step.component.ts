import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-status-stepper-step',
  templateUrl: './status-stepper-step.component.html',
  styleUrls: ['./status-stepper-step.component.scss']
})
export class StatusStepperStepComponent implements OnInit {
  @Input() progressStepperType: any = [];
  public stepStatus: any;

  constructor() {
  }

  ngOnInit(): void {
    this.checkStatusTypeOfTask(this.progressStepperType);
  }

  // inner method, dont use
  public checkStatusTypeOfTask(stepperType): void {
    stepperType.steps.map((el) => {
      if (el.status.toLowerCase() !== 'completed') {
        this.stepStatus = '';
      } else {
        this.stepStatus = 'type-completed';
      }
    });
  }

  toFloor(x): number {
    return Math.floor(x);
  }

}
