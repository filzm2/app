import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDashboardFilter } from '@app/models/dashboard/dashboard.model';

@Component({
  selector: 'app-manager-filter-dialog',
  templateUrl: './manager-filter-dialog.component.html',
  styleUrls: ['./manager-filter-dialog.component.scss']
})
export class ManagerFilterDialogComponent implements OnInit {

  @Output() chooseData = new EventEmitter<any>();

  public filterData: Array<any>;
  public selectedFilterIndex = 0;
  public selectedData: any;
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
    this.filterData[this.selectedFilterIndex].quarter = event.quarter;
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
      quarter: '',
    });
    this.selectedFilterIndex = this.filterData.length - 1;
    this.selectedData = this.filterData[this.selectedFilterIndex];
  }

}
