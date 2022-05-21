import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-color-schema-select',
  templateUrl: './color-schema-select.component.html',
  styleUrls: ['./color-schema-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ColorSchemaSelectComponent implements OnInit {

  @Input() public control: FormControl;
  public schemes = [
    {
      value: 'supersetColors',
      label: 'Суперсет',
      colors: [
        '#2a3179',
        '#a43DE3',
        '#a26126',
        '#FF89a3',
        '#FF0698',
        '#9EAB0F',
      ],
    },
    {
      value: 'psbColors',
      label: 'ПромСвязьБанк',
      colors: [
        '#263179',
        '#243DE3',
        '#F26126',
        '#FF8953',
        '#FFB698',
        '#9EABFF',
      ],
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
