import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IDashboardFilter } from '@app/models/dashboard/dashboard.model';
import { DashboardFilterDialogComponent } from '../dashboard-filter-dialog/dashboard-filter-dialog.component';

@Component({
  selector: 'app-dashboard-filters',
  templateUrl: './dashboard-filters.component.html',
  styleUrls: ['./dashboard-filters.component.scss'],
})
export class DashboardFiltersComponent implements OnInit {
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
    const dialogRef = this.dialog.open(DashboardFilterDialogComponent, {
      autoFocus: false,
      data: newFilter
        ? {
            filtersData: [
              { name: 'Новый фильтр', type: '', default: false, data: null },
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
          if (filter.default) {         // После закрытия окна выбираем фильтр, выбранный по умолчанию
            this.selectedIndex = index;
          }
        });

        this.chooseData.emit({
          timerange: this.filters[this.selectedIndex]?.data,
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
  // todo дергать обновление данных графиков
  // todo помечать графики, которые были
  changeFilterActive(index): void {
    this.selectedIndex = index === this.selectedIndex ? -1 : index;
    console.log(this.selectedIndex);
    this.chooseData.emit({
      timerange: this.filters[this.selectedIndex]?.data,
      filters: this.filters,
    });
  }

  changeFilterDetail(event) {
    Object.assign(this.openFilterData, event);
  }

  saveFilterPopup() {
    this.dashboardFilters.forEach((filter) => {
      filter.default = false;
    });
    this.filters[this.openFilterIndex].type = this.openFilterData.type;
    this.filters[this.openFilterIndex].default = this.openFilterData.default;
    if (this.openFilterData.type === 'last') {
      this.filters[this.openFilterIndex].data = this.openFilterData.last;
    } else if (this.openFilterData.type === 'calendar') {
      this.filters[this.openFilterIndex].data = this.openFilterData.lastCalendar;
    } else if (this.openFilterData.type === 'custom') {
      this.filters[
        this.openFilterIndex
      ].data = `${this.openFilterData.start.toISOString()} : ${this.openFilterData.end.toISOString()}`;
    }

    this.selectedIndex = this.openFilterIndex;
    this.chooseData.emit({
      timerange: this.filters[this.selectedIndex]?.data,
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
