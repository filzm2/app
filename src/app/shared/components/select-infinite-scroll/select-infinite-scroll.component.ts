import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatSelect} from "@angular/material/select";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-select-infinite-scroll',
  templateUrl: './select-infinite-scroll.component.html',
  styleUrls: ['./select-infinite-scroll.component.scss']
})
export class SelectInfiniteScrollComponent implements OnInit {

  @Input() public options = [];
  @Input() public label: string;
  @Input() public control: FormControl = new FormControl();
  @Output() public updateList = new EventEmitter();
  @ViewChild('select') public select: MatSelect;
  private scrollHandler = event => this.loadAllOnScroll(event)
  private panel: any;

  constructor() { }

  ngOnInit(): void {
  }

  onOpen(event: any) {
    if (event) {
      this.registerPanelScrollEvent();
      return
    }
    this.unRegisterPanelScrollEvent();
  }

  registerPanelScrollEvent() {
    this.panel = this.select.panel.nativeElement;
    this.panel.addEventListener('scroll', this.scrollHandler);
  }

  unRegisterPanelScrollEvent() {
    this.panel.removeEventListener('scroll', this.scrollHandler);
  }

  loadAllOnScroll(event) {
    if (event.target.scrollHeight - event.target.scrollTop < 300) {
      this.updateList.emit(true);
    }
  }
}
