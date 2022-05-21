import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-ui-chip',
  templateUrl: 'chip.component.html',
  styleUrls: ['chip.component.scss']
})

export class ChipComponent {

  @Input() primary = false;
  @Input() active = false;
  @Input() prefixIcon: 'cancel' | 'delete' | 'error_outline' | 'check_circle'  | '' = '';
  @Input() postfixIcon: 'cancel' | 'delete' | 'error_outline' | 'check_circle'  | '' = '';

  @Output() clickChip: EventEmitter<any> = new EventEmitter<any>();

  onClick(): void {
    this.clickChip.emit();
  }
}
