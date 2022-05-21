import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {pairwise} from "rxjs/operators";

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

  @Output() public pickedColor: EventEmitter<string> = new EventEmitter<string>();
  @Input() set currentColor(key: string) {
    this.selectColor(key);
  }

  public colors: any[] = [
    '1FA8C9',
    '454E7C',
    '5AC189',
    'FF7F44',
    '666666',
    'E04355',
    'FCC700',
    'A868B7',
    '3CCCCB',
    'A38F79',
    '8FD3E4',
    'A1A6BD',
    'ACE1C4',
    'FEC0A1',
    'B2B2B2',
    'EFA1AA',
    'FDE380',
    'D3B3DA',
    '9EE5E5',
    'D1C6BC',
  ];
  public _currentColor: any = {
    red: '0',
    green: '0',
    blue: '0',
    hex: '000000'
  };
  public group: FormGroup;
  private isDefaultColor = true;

  constructor(public fb: FormBuilder) {
    this.group = this.fb.group(this._currentColor);
  }

  ngOnInit(): void {
    this.group.valueChanges.pipe(pairwise()).subscribe(([prev, current]) => {
      console.log(prev,current)
      if (prev.hex !== current.hex) {
        if (current.hex.length !== 6) return;
        this.selectColor(current.hex);
        return;
      }
      this._currentColor = current;
      console.log((+current.red).toString(16), (+current.green).toString(16), (+current.blue).toString(16));
      this._currentColor.hex = (+current.red).toString(16).padStart(2, '0')
        + (+current.green).toString(16).padStart(2, '0')
        + (+current.blue).toString(16).padStart(2, '0');
      this.group.setValue(this._currentColor, {emitEvent: false});
      this.pickColor(this._currentColor.hex);
      this.isDefaultColor = false;
    });
  }

  public selectColor(color: any) {
    this._currentColor.hex = color;
    this._currentColor.red = parseInt(color.slice(0, 2), 16);
    this._currentColor.green = parseInt(color.slice(2, 4), 16);
    this._currentColor.blue = parseInt(color.slice(4, 6), 16);
    this.group.setValue(this._currentColor, {emitEvent: false});
    this.pickColor(color);
    this.isDefaultColor = false;
  }

  public pickColor(color: string): void {
    this.pickedColor.emit(color);
  }

  public pickDefaultColor() {
    this.selectColor('000000');
    this.isDefaultColor = true;
  }
}
