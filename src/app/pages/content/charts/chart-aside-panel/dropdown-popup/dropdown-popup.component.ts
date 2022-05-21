import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";
import moment from "moment";

@Component({
  selector: 'app-dropdown-popup',
  templateUrl: './dropdown-popup.component.html',
  styleUrls: ['./dropdown-popup.component.scss']
})
export class DropdownPopupComponent implements OnInit {

  public formGroup: FormGroup;
  public type: string = 'last';
  public dates;
  public typeOfRange: string = 'last';

  public typesOfRange: { label: string, value: string }[] = [
    {label: 'Настроить время', value: 'custom'},
    {label: 'Предыдущий', value: 'previous'},
    {label: 'Последний', value: 'last'},
    {label: 'Без фильтра', value: 'no_filter'},
    {label: 'Расширенный', value: 'advanced'},
  ];
  public customDateSettings: any = {
    startType: 'now',
    endType: 'now',
  };
  public wrongDate: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DropdownPopupComponent>,
    private fb: FormBuilder) {
    this.dates = {
      startDate: new Date().setDate(new Date().getDate() - 1),
      endDate: new Date(),
      today: new Date(),
    };
  }

  ngOnInit(): void {
    console.log('open', this.data);
    switch (this.data.key) {
      case 'time_range':
        this.formGroup = this.fb.group({
          type: 'last',
          last_radio: 'last_day',
          previous_radio: 'previous_week',
          custom_start: this.dates.today,
          custom_end: this.dates.today,
          custom_start_type: 'now',
          custom_end_type: 'now',
        });
        break;
    }


    this.formGroup.valueChanges.subscribe((value) => {


      this.wrongDate = false;

      if (value.type === 'last') {
        this.type = 'last';
        switch (value.last_radio) {
          case 'last_day':
            this.dates.startDate = 'Last day';
            this.dates.endDate = 'Последний день';
            break;
          case 'last_week':
            this.dates.startDate = 'Last week';
            this.dates.endDate = 'Последняя неделя';
            break;
          case 'last_month':
            this.dates.startDate = 'Last month';
            this.dates.endDate = 'Последний месяц';
            break;
          case 'last_quarter':
            this.dates.startDate = 'Last quarter';
            this.dates.endDate = 'Последний квартал';
            break;
          case 'last_year':
            this.dates.startDate = 'Last year';
            this.dates.endDate = 'Последний год';
        }
      } else if (value.type === 'previous') {
        this.type = 'previous';
        switch (value.previous_radio) {
          case 'previous_week':
            this.dates.startDate = 'previous calendar week';
            this.dates.endDate = 'Предыдущая календарная неделя';
            break;
          case 'previous_month':
            this.dates.startDate = 'previous calendar month';
            this.dates.endDate = 'Предыдущий календарный месяц';
            break;
          case 'previous_year':
            this.dates.startDate = 'previous calendar year';
            this.dates.endDate = 'Предыдущий календарный год';
        }

      } else if (value.type === 'no_filter') {
        this.type = 'no_filter';
        this.dates.startDate = '-∞';
        this.dates.endDate = '∞';
      } else if (value.type === 'advanced') {
        this.type = 'advanced';
      } else if (value.type === 'custom') {
        this.type = 'custom';
        this.customDateSettings.startType = value.custom_start_type;
        this.customDateSettings.endType = value.custom_end_type;
        this.dates.startDate = value.custom_start;
        this.dates.endDate = value.custom_end;
        if (value.custom_start_type === 'now') {
          this.dates.startDate = new Date();
        }
        if (value.custom_end_type === 'now') {
          this.dates.endDate = new Date();
        }
        if (value.custom_start_type === 'midnight') {
          this.dates.startDate = new Date();
          this.dates.startDate.setHours(0, 0, 0, 0);
        }
        if (value.custom_end_type === 'midnight') {
          this.dates.endDate = new Date();
          this.dates.endDate.setHours(0, 0, 0, 0);
        }
      } else if (value.type === 'advanced') {
      }

      const range = this.dates.endDate - this.dates.startDate;
      console.log(range);
      if (range < 0) {
        this.wrongDate = true;
      }

    });
  }

  submit(): void {
    let form

    if (this.type === 'no_filter') {
      form = {
        value: 'No filter',
        label: 'Без фильтра'
      };
    } else if(this.type === 'last' || this.type === 'previous') {

      form = {
        value: this.dates.startDate,
        label: this.dates.endDate
      }

    } else {
      form = {
        value: `${this.dates.startDate.toISOString()} : ${this.dates.endDate.toISOString()}`,
        label: `${this.dates.startDate.toLocaleString()} : ${this.dates.endDate.toLocaleString()}`
      }
    }
    this.dialogRef.close({form});
  }

  public close(): void {
    this.dialogRef.close();
  }
}
