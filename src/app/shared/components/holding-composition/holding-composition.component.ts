import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MOCK_COMPOSITION} from './holding-composition.mock';

@Component({
  selector: 'app-ui-holding-composition',
  templateUrl: './holding-composition.component.html',
  styleUrls: ['./holding-composition.component.scss']
})
export class HoldingCompositionComponent implements OnInit {
  @Input() status = false;
  @Input() composition = MOCK_COMPOSITION;
  @Input() changeMode = false;
  @Output() idx = new EventEmitter<number>();
  @ViewChild('compositionDiv') block: ElementRef;
  compositionVisible = [];
  currentSelected = 0;
  divHeight = 'auto';
  mode = false;


  constructor() { }

  ngOnInit(): void {
    if (this.changeMode) {
      setTimeout(() => {
        this.divHeight = `${document.getElementById(`uiChips${0}`).offsetHeight * 2.5}px`;
        this.checkHeight();
        this.mode = true;
      }, 0);
      let timeOut: any = false;
      window.onresize = () => {
        if (timeOut) {
          clearTimeout(timeOut);
        }
        timeOut = setTimeout(() => {
          this.compositionVisible = this.composition;
          this.checkHeight();
          clearTimeout(timeOut);
          timeOut = false;
        }, 100);
      };
    }
  }

  switchMode = () => {
    this.mode = !this.mode;
  }

  getSpanTitle = () => {
    return this.mode ?
      `Еще ${this.composition.length - this.compositionVisible.length} компаний`
      : 'Свернуть';
  }

  checkHeight(): void {
    const divWidth = this.block.nativeElement.offsetWidth;
    let divCurrWidth = divWidth;
    let count = 0;
    let buttonWidth = true;
    const tempComposition = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.composition.length; ++i) {
      if (count === 1 && buttonWidth) {
        divCurrWidth -= (document.getElementById('addButton')?.offsetWidth + 20);
        buttonWidth = false;
      }
      divCurrWidth -= (document.getElementById(`uiChips${i}`)?.offsetWidth + 20);
      if (divCurrWidth > 0 && count < 2) {
        tempComposition.push(this.composition[i]);
      } else {
        divCurrWidth = divWidth;
        if (divCurrWidth > 0) {
          divCurrWidth -= (document.getElementById(`uiChips${i}`)?.offsetWidth + 20);
        }
        if (count === 0) {
          tempComposition.push(this.composition[i]);
        }
        count += 1;
      }
    }
    this.compositionVisible = tempComposition;
  }
  selectLegal = (idx: number) => {
    this.idx.emit(idx);
    this.composition[this.currentSelected].selected = false;
    this.composition[idx].selected = true;
    this.currentSelected = idx;
  }

  checkStatus(status: number): 'cancel' | 'delete' | 'error_outline' | 'check_circle' {
    return status === 1 ? 'cancel' : status === 2 ? 'error_outline' : 'check_circle';
  }
}
