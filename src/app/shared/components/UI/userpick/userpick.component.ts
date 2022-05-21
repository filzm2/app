import {Component, Input} from '@angular/core';
// import {IUserpick} from '../../../../core/interfaces/userpick.model';

@Component({
  selector: 'app-ui-userpick',
  templateUrl: 'userpick.component.html',
  styleUrls: ['userpick.component.scss']
})

export class UserpickComponent {

  @Input() onlyPhoto = true;
  @Input() data: any;
  @Input() isOnline = false;
  @Input() size = 5;

}
