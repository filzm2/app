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
  selector: 'app-manager-filter-bar',
  templateUrl: './manager-filter-bar.component.html',
  styleUrls: ['./manager-filter-bar.component.scss']
})
export class ManagerFilterBarComponent implements OnInit {
  @Input() filterData: any;
  @Output() changeFilter = new EventEmitter<any>();
  constructor(private store: Store<appState.State>) {}

  private _destroy$ = new Subject<null>();

  public filterForm = new FormGroup({
    quarter: new FormControl(),
  });

  public factStartDate = new Date();
  public factEndDate = new Date();
  public today = new Date();

  ngOnInit(): void {
    this.initForm();
    this.filterForm.valueChanges.subscribe((value) => {
      this.changeFilter.emit(value);
    });
  }

  ngOnChanges(): void {
    this.initForm();
  }

  private initForm() {
    this.filterForm.setValue({
      quarter: this.filterData.quarter,
    });
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
  }

}
