import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-chart-view',
  templateUrl: './table-chart-view.component.html',
  styleUrls: ['./table-chart-view.component.scss']
})
export class TableChartViewComponent implements OnInit {
  @Input() set data(data) {
    this.columns = data?.colnames;
    this.tableData = data?.data;
  };

  public columns: Array<string> = [];
  public tableData: Array<any>;
  constructor() { }

  ngOnInit(): void {
  }

}
