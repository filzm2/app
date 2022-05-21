import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-expansion-card',
  templateUrl: './expansion-card.component.html',
  styleUrls: ['./expansion-card.component.scss']
})
export class ExpansionCardComponent {

  @Input() title = '';
  @Input() isOpen = false;

  toggleContent(): void {
    this.isOpen = !this.isOpen;
  }

}
