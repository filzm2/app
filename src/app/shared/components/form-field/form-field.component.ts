import { Component, EventEmitter, Input, Output } from '@angular/core';
import {FormService} from '@core/services/form.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent {

  @Input() public control: FormControl;
  @Input() public label: string;
  @Input() public placeholder: string;
  @Input() public appDisabled = false;
  @Input() public hint: string;
  @Input() public size: 'm' | 'l' = 'm'
  @Input() public relativeHint = false;
  @Input() public type: 'password' | 'text' = 'text';
  @Input() public inputMode: 'numeric' | 'text' = 'text';
  @Output() public blurEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private formService: FormService) {
  }

  public getErrors(): string {
    return this.formService.getErrorMessage(this.control);
  }

  public onBlur(): void {
    this.blurEvent.emit();
  }
}
