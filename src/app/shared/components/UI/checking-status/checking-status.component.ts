import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-checking-status',
  templateUrl: './checking-status.component.html',
  styleUrls: ['./checking-status.component.scss']
})
export class CheckingStatusComponent implements OnInit {
  @Input() caption = '';
  @Input() type: 'success' | 'alerted' | 'denied';

  constructor() { }

  ngOnInit(): void {
  }

}
