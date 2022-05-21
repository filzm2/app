import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-multi-select-panel',
  templateUrl: './multi-select-panel.component.html',
  styleUrls: ['./multi-select-panel.component.scss']
})
export class MultiSelectPanelComponent implements OnInit {

  @Input() availableAdd = false;
  @Input() label: string;
  @Input() selected: { label: string, value: any }[] = [];
  @Input() availableDeleteItem: boolean = true;
  @Output() addClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemClick: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  public itemClickHandler(item: { label: string, value: any }, event: any, index: number): void {
    this.itemClick.emit({item, event, index});
  }

  public add(event: any): void {
    this.addClick.emit({event});
  }

  public deleteItem(i: number) {
    this.selected.splice(i, 1);
  }
}
