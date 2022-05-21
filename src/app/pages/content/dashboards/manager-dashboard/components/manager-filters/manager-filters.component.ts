import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IDashboardFilter } from '@app/models/dashboard/dashboard.model';
import { ManagerFilterDialogComponent } from '../manager-filter-dialog/manager-filter-dialog.component';


@Component({
  selector: 'app-manager-filters',
  templateUrl: './manager-filters.component.html',
  styleUrls: ['./manager-filters.component.scss']
})
export class ManagerFiltersComponent implements OnInit {

  @Input() dashboardFilters: Array<IDashboardFilter>;
  @Output() chooseData = new EventEmitter<any>();

  filters: Array<any> = [];
  public selectedIndex = -1;
  public openFilterIndex = -1;
  public openFilterData: any = {};
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.dashboardFilters.length) {
      // this.filters = this.dashboardFilters;
      Object.values(this.dashboardFilters).forEach((filter, filterIndex) => {
        this.filters.push(filter);
      });
      this.selectedIndex = this.filters.findIndex((element) => {
        return element.default;
      });
    }
  }

  openFilterDialog(newFilter: boolean) {
    const dialogRef = this.dialog.open(ManagerFilterDialogComponent, {
      autoFocus: false,
      data: newFilter
        ? {
            filtersData: [
              { name: 'Новый фильтр', quarter: '' },
              ...this.dashboardFilters,
            ],
          }
        : { filtersData: this.dashboardFilters },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.filters = [];

        Object.values(result).forEach((filter: any, index: number) => {
          this.filters.push(filter);
          this.selectedIndex = index;
        });

        this.chooseData.emit({
          timerange: this.filters[this.selectedIndex]?.quarter,
          filters: this.filters,
        });
      }
    });
  }

  openFilterPopup(index) {
    if (this.openFilterIndex !== index) {
      this.clearObjectCompletely(this.openFilterData);
      this.openFilterIndex = index;
    } else {
      this.clearObjectCompletely(this.openFilterData);
      this.openFilterIndex = -1;
    }
  }


  changeFilterActive(index): void {
    this.selectedIndex = index === this.selectedIndex ? -1 : index;
    this.chooseData.emit({
      timerange: this.filters[this.selectedIndex]?.quarter,
      filters: this.filters,
    });
  }

  changeFilterDetail(event) {
    Object.assign(this.openFilterData, event);
  }

  saveFilterPopup() {
    this.filters[this.openFilterIndex].quarter = this.openFilterData.quarter;
    this.selectedIndex = this.openFilterIndex;
    this.chooseData.emit({
      timerange: this.openFilterData.quarter,
      filters: this.filters,
    });
    this.openFilterIndex = -1;
    Object.assign(this.openFilterData, {});
  }

  closeFilterPopup() {
    Object.assign(this.openFilterData, {});
    this.openFilterIndex = -1;
  }

  isEmptyObject(obj: any) {
    return obj && Object.keys(obj).length === 0;
  }

  clearObjectCompletely(obj: any) {
    for (const prop of Object.getOwnPropertyNames(obj)) {
      delete obj[prop];
    }
  }
}
