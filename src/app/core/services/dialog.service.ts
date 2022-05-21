import {Injectable} from '@angular/core';
import {PopupWarningComponent} from "@shared/components/popups/popup-warning/popup-warning.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class DialogService {

  constructor(private dialog: MatDialog, private snack: MatSnackBar) {
  }

  public errorHandler(result: any): void {
    if (result.error) {
      this.dialog.open(PopupWarningComponent, {
        data: {
          title: 'Ошибка',
          text: result.error?.message ?? result.error,
          btnSuccessTitle: 'Ok',
          json: true,
        }
      });
    }
  }

  public errorLightHandler(result: any): void {
    if (result.error) {
      this.snack.open(result.error?.message ?? result.error, 'x', {horizontalPosition: 'end', duration: 2000});
    }
  }
}
