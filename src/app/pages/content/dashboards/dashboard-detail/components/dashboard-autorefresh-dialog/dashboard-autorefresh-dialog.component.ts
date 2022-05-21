import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDashboardIntervalType } from '@app/models/dashboard/dashboard.model';
@Component({
  selector: 'app-dashboard-autorefresh-dialog',
  templateUrl: './dashboard-autorefresh-dialog.component.html',
  styleUrls: ['./dashboard-autorefresh-dialog.component.scss']
})
export class DashboardAutorefreshDialogComponent implements OnInit {

  public control: FormControl;
  public intervalTypes: Array<IDashboardIntervalType> = [
    {
      value: 0,
      name: 'Не обновлять'
    },
    {                   
      value: 10000,
      name: '10 секунд'
    },
    {
      value: 60000,
      name: 'Минута'
    },
    {
      value: 3600000,
      name: 'Час'
    },
    {
      value: 86400000,
      name: 'День'
    }
  ];
  public selectedInterval: number = 0;

  constructor(
    private dialogRef: MatDialogRef<DashboardAutorefreshDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.control = new FormControl(data.value);
    this.selectedInterval = data.value;
   }

  ngOnInit(): void {
  }

  submit() {
    this.dialogRef.close({
      close: false,
      data: this.control});
  }

  close() {
    this.dialogRef.close({
      close: true
    });
  }

}
