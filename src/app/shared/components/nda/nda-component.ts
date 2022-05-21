import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-form-nda',
  templateUrl: 'nda.component.html',
  styleUrls: ['nda-component.scss']
})

export class NdaComponent {
@Input() formType = 'sign';
@Input() required = false;
@Input() sign = false;
@Output() condition: EventEmitter<any> = new EventEmitter<any>();

  isUploaded = false;
  signRes = false;
  requireRes = false;

  logResult(): void {
    if (this.formType === 'sign') {
      console.log(this.signRes);
      this.condition.emit(this.signRes);
    } else {
      console.log(this.requireRes);
    }
  }

  fileUpload(event: any): void {
    console.log('uploaded!!!', event);
    this.isUploaded = true;
  }
}
