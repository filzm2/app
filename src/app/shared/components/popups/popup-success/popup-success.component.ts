import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface DialogData {
  title: string;
  text: string;
  btnSuccessTitle: string;
  showBtnClose: boolean;
  btnCloseTitle: string;
}

@Component({
  selector: 'app-popup-success',
  templateUrl: './popup-success.component.html',
  styleUrls: ['./popup-success.component.scss']
})
export class PopupSuccessComponent {
  constructor(
    public dialogRef: MatDialogRef<PopupSuccessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }

  onCancelClick(): void {
    this.dialogRef.close({event: 'cancel'});
  }

  onConfirmClick(): void {
    this.dialogRef.close({event: 'confirm'});
  }

}
