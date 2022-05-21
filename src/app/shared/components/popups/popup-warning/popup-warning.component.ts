import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-popup-warning',
  templateUrl: './popup-warning.component.html',
  styleUrls: ['./popup-warning.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PopupWarningComponent {
  constructor(
    public dialogRef: MatDialogRef<PopupWarningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

}
