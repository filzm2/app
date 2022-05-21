import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-ui-icon',
  templateUrl: 'icon.component.html',
  styleUrls: ['icon.component.scss']
})

export class IconComponent {

  @Input() icon = '';
  @Input() size = 24;
}
