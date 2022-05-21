import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-ui-button',
  templateUrl: 'button.component.html',
  styleUrls: ['button.component.scss']
})

export class ButtonComponent {
@Input() title = 'button';
@Input() color = 'red';
@Input() disable = false;
@Output() clickButton: EventEmitter<any> = new EventEmitter<any>();

onClick(): void {
  this.clickButton.emit('hello!');
}
}
