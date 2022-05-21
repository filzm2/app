import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDashboardFilter } from '@app/models/dashboard/dashboard.model';

@Component({
  selector: 'app-dashboard-filter-dialog',
  templateUrl: './dashboard-filter-dialog.component.html',
  styleUrls: ['./dashboard-filter-dialog.component.scss'],
})
export class DashboardFilterDialogComponent implements OnInit {
  @Output() chooseData = new EventEmitter<any>();

  public filterData: Array<IDashboardFilter>;
  public selectedFilterIndex = 0;
  public selectedData: IDashboardFilter;
  name = '';
  timePeriod = 'lastDay';
  tooltipToggle = false;

  // todo hide
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.filterData = this.data.filtersData;
    this.selectedData = this.filterData[this.selectedFilterIndex];
  }

  changeTimePeriod(): void {}

  public selectFilter(index): void {
    this.selectedFilterIndex = index;
    this.selectedData = this.filterData[index];
  }

  openTooltip() {
    this.tooltipToggle = !this.tooltipToggle;
  }

  changeFilter(event) {
    console.log(event)
    if (event.default) {
      this.filterData.forEach((filter) => {
        filter.default = false;
      });
    }
    this.filterData[this.selectedFilterIndex].type = event.type;
    this.filterData[this.selectedFilterIndex].default = event.default;
    if (event.type === 'last') {
      this.filterData[this.selectedFilterIndex].data = event.last;
    } else if (event.type === 'calendar') {
      this.filterData[this.selectedFilterIndex].data = event.lastCalendar;
    } else if (event.type === 'custom') {
      this.filterData[this.selectedFilterIndex].data =
        event.start && event.end ? `${event.start.toISOString()} : ${event.end.toISOString()}` : '';
    }
    // debugger
  }

  deleteFilter(index) {
    this.filterData.splice(index, 1);
    this.selectedFilterIndex = 0;
    this.selectedData = this.filterData[this.selectedFilterIndex];
  }

  addNewFilter() {
    this.filterData.push({
      name: 'Новый фильтр',
      type: '',
      default: false,
      data: '',
    });
    this.selectedFilterIndex = this.filterData.length - 1;
    this.selectedData = this.filterData[this.selectedFilterIndex];
  }
}
