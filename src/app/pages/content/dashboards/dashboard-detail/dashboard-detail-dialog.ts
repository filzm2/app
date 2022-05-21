import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface IDialogData {
  title: string;
  isBlockSub: boolean;
  isEmailSub: boolean;
  frequency: number;
  emails: { value: string }[];
}

@Component({
  selector: 'app-dashboard-detail-dialog',
  templateUrl: './dashboard-detail-dialog.html',
  styleUrls: ['./dashboard-detail-dialog.scss'],
})
export class DashboardDetailDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    public dialogRef: MatDialogRef<DashboardDetailDialogComponent>,
  ) { }

  addRowEmail(): void {
    this.data.emails.push({ value: '' });
  }

  frequencyChanged(value: string): void {
    this.data.frequency = Number(value);
  }

  onNoClick(): void {
    this.data.emails = [];
    this.dialogRef.close({ type: 'cancel' });
  }

  onOkClick(): void {
    if (this.data.emails.filter(({ value }) => value.length > 0).length > 0) {
      this.dialogRef.close({ type: 'confirm', data: this.data });
    }
  }
}
