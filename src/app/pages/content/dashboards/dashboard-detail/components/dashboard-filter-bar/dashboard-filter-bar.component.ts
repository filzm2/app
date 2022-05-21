import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IDashboardFilter } from '@app/models/dashboard/dashboard.model';
import { Store, select } from '@ngrx/store';
import * as appState from '@store/reducers/index';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TimeRangeGet } from '@app/store/actions/timerange/timerange.actions';
import moment from 'moment';

@Component({
  selector: 'app-dashboard-filter-bar',
  templateUrl: './dashboard-filter-bar.component.html',
  styleUrls: ['./dashboard-filter-bar.component.scss'],
})
export class DashboardFilterBarComponent implements OnChanges, OnInit {
  @Input() filterData: IDashboardFilter;
  @Output() changeFilter = new EventEmitter<any>();
  constructor(private store: Store<appState.State>) {}

  private _destroy$ = new Subject<null>();

  public lastFilter = [
    { title: 'День', name: 'Last day' },
    { title: 'Неделя', name: 'Last week' },
    { title: 'Месяц', name: 'Last month' },
    { title: 'Квартал', name: 'Last quarter' },
    { title: 'Год', name: 'Last year' },
  ];

  public lastCalendarFilter = [
    { title: 'Календарная неделя', name: 'previous calendar week' },
    { title: 'Календарный месяц', name: 'previous calendar month' },
    { title: 'Календарный год', name: 'previous calendar year' },
  ];

  public filterForm = new FormGroup({
    default: new FormControl(),
    type: new FormControl(),
    last: new FormControl(),
    lastCalendar: new FormControl(),
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
  });

  public factStartDate = new Date();
  public factEndDate = new Date();
  public today = new Date();

  ngOnInit(): void {
    this.initForm();
    this.filterForm.valueChanges.subscribe((value) => {
      if (value.type === 'last') {
        switch (value.last) {
          case 'Last day':
            this.factStartDate = new Date();
            this.factStartDate.setDate(this.today.getDate() - 1);
            this.factEndDate = new Date();
            console.log(this.factStartDate);
            break;
          case 'Last week':
            this.factStartDate = new Date();
            this.factStartDate.setDate(this.today.getDate() - 7);
            this.factEndDate = new Date();
            console.log(this.factStartDate);
            break;
          case 'Last month':
            this.factStartDate = new Date();
            this.factStartDate.setMonth(this.today.getMonth() - 1);
            this.factEndDate = new Date();
            console.log(this.factStartDate);
            break;
          case 'Last quarter':
            this.factStartDate = new Date();
            this.factStartDate.setMonth(this.today.getMonth() - 3);
            this.factEndDate = new Date();
            console.log(this.factStartDate);
            break;
          case 'Last year':
            this.factStartDate = new Date();
            this.factStartDate.setFullYear(this.today.getFullYear() - 1);
            this.factEndDate = new Date();
            console.log(this.factStartDate);
            break;
        }
        // this.store.dispatch(TimeRangeGet({payload: value.last}));
      } else if (value.type === 'calendar') {
        switch (value.lastCalendar) {
          case 'previous calendar week':
            this.factStartDate = moment().subtract(1, 'week').startOf('week').toDate();
            this.factEndDate = moment().subtract(1, 'week').endOf('week').toDate();
            break;
          case 'previous calendar month':
            this.factStartDate = moment().subtract(1, 'month').startOf('month').toDate();
            this.factEndDate = moment().subtract(1, 'month').endOf('month').toDate();
            break;
          case 'previous calendar year':
            this.factStartDate = moment().subtract(1, 'year').startOf('year').toDate();
            this.factEndDate = moment().subtract(1, 'year').endOf('year').toDate();
            break;
        }
        // this.store.dispatch(TimeRangeGet({payload: value.lastCalendar}));
      } else if (value.type === 'custom') {
        this.factStartDate = value.start;
        this.factEndDate = value.end;
      }
      console.log(this.filterForm.valid)
      this.changeFilter.emit(value);
    });

    // this.store.pipe(takeUntil(this._destroy$), select('timerange'))
    //   .subscribe(res => {
    //     console.log('timerange', res);
    //    });
  }

  ngOnChanges(): void {
    this.initForm();
  }

  private initForm() {
    let startDate: Date;
    let endDate: Date;
    if (this.filterData.type === 'custom') {
      let splittedTimerange = this.filterData.data.split(' : ');
      if (splittedTimerange.length === 2) {
        startDate = new Date(splittedTimerange[0]);
        endDate = new Date(splittedTimerange[1]);
      }
    }
    this.filterForm.setValue({
      default: this.filterData.default,
      type: this.filterData.type,
      last: this.filterData.data || 'Last day',
      lastCalendar: this.filterData.data || 'previous calendar week',
      start: startDate || '',
      end: endDate || '',
    });
    this.createFactData(this.filterForm.value);
  }

  public onFormSubmit() {
    console.log(this.filterForm, this.filterForm.valid)
    this.changeFilter.emit(this.filterForm.value);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  createFactData(value) {
    if (value.type === 'last') {
      switch (value.last) {
        case 'Last day':
          this.factStartDate = new Date();
          this.factStartDate.setDate(this.today.getDate() - 1);
          this.factEndDate = new Date();
          console.log(this.factStartDate);
          break;
        case 'Last week':
          this.factStartDate = new Date();
          this.factStartDate.setDate(this.today.getDate() - 7);
          this.factEndDate = new Date();
          console.log(this.factStartDate);
          break;
        case 'Last month':
          this.factStartDate = new Date();
          this.factStartDate.setMonth(this.today.getMonth() - 1);
          this.factEndDate = new Date();
          console.log(this.factStartDate);
          break;
        case 'Last quarter':
          this.factStartDate = new Date();
          this.factStartDate.setMonth(this.today.getMonth() - 3);
          this.factEndDate = new Date();
          console.log(this.factStartDate);
          break;
        case 'Last year':
          this.factStartDate = new Date();
          this.factStartDate.setFullYear(this.today.getFullYear() - 1);
          this.factEndDate = new Date();
          console.log(this.factStartDate);
          break;
      }
      // this.store.dispatch(TimeRangeGet({payload: value.last}));
    } else if (value.type === 'calendar') {
      switch (value.lastCalendar) {
        case 'previous calendar week':
          this.factStartDate = moment().subtract(1, 'week').startOf('week').toDate();
          this.factEndDate = moment().subtract(1, 'week').endOf('week').toDate();
          break;
        case 'previous calendar month':
          this.factStartDate = moment().subtract(1, 'month').startOf('month').toDate();
          this.factEndDate = moment().subtract(1, 'month').endOf('month').toDate();
          break;
        case 'previous calendar year':
          this.factStartDate = moment().subtract(1, 'year').startOf('year').toDate();
          this.factEndDate = moment().subtract(1, 'year').endOf('year').toDate();
          break;
      }
      // this.store.dispatch(TimeRangeGet({payload: value.lastCalendar}));
    } else if (value.type === 'custom') {
      this.factStartDate = value.start;
      this.factEndDate = value.end;
    }
  }
}
