import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss']
})
export class HintComponent implements OnInit {
  @Input() caption = '';

  constructor() { }

  ngOnInit(): void {
  }

}
