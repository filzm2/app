import {Component, Input, OnInit} from '@angular/core';
import {TestClient} from '../../../modules/dashboard/components/search-company-popup/search-company-popup.component';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-pledge-table',
  templateUrl: './pledge-table.component.html',
  styleUrls: ['./pledge-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('detailRolled', [
      state('rolled', style({height: '0px', minHeight: '0'})),
      state('opened', style({height: '*'})),
      transition('rolled <=> opened', animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PledgeTableComponent {
  /** Вкладка Обеспечение */
  @Input() set clients(value: any[]) {
    this.suretyDataSource = value;
  }
  @Input() editable = false;
  @Input() suretyType = 'Вид обеспечения';
  suretyDataSource: any[];
  suretyColumnsToDisplay = ['surety_type', 'pledger', 'inn', 'actions'];
  suretyExpandedElement: TestClient | null;
  constructor() { }

  editSuretyItem(item): void {
    console.log('item: ', item);
  }

  deleteSuretyItem(item): void {
    this.suretyDataSource = this.suretyDataSource.filter(sr => {
      return sr.pledger !== item.pledger;
    });
  }
}



