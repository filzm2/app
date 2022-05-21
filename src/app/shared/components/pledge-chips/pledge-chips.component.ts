import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pledge-chips',
  templateUrl: './pledge-chips.component.html',
  styleUrls: ['./pledge-chips.component.scss']
})
export class PledgeChipsComponent implements OnInit {
  chips = [];

  @Output() propertyType: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    this.chips = chips;
  }

  setActiveChip(caption: HTMLTableCaptionElement): void {
    this.clearAllChips();
    const chipToActive = this.chips.filter(chip => chip.caption === caption)[0];
    chipToActive.active = true;
    this.propertyType.emit(chipToActive.type)
  }

  clearAllChips(): void {
    this.chips = this.chips.map(chip => {
      return {...chip, active: false}
    })
  }
}

interface ICHIP {
  type: string;
  icon: string;
  caption: string;
  active: boolean
}

const chips: ICHIP[] = [
  {type: 'immovables', icon: 'home', caption: 'Недвижи–мость', active: true},
  {type: 'transport', icon: 'directions_car', caption: 'Транспортное средство', active: false},
  {type: 'equipment', icon: 'computer', caption: 'Оборудование', active: false},
  {type: 'waterTransport', icon: 'directions_boat', caption: 'Водный транспорт', active: false},
  {type: 'airVessel', icon: 'flight', caption: 'Воздушное судно', active: false},
  {type: 'rollingStock', icon: 'directions_subway', caption: 'Подвижной состав', active: false},
  {type: 'rights', icon: 'list_alt', caption: 'Права', active: false},
  {type: 'other', icon: 'work_outline', caption: 'Прочее', active: false},
];
