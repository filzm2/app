import { Component, Inject, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { selectAllUsersOptions } from '@store/selectors/security/security.selector';
import { takeUntil } from 'rxjs/operators';
import { UserRelated } from '@store/actions/settings/security.actions';

@Component({
  selector: 'app-popup-dashboard-owners',
  templateUrl: './popup-dashboard-owners.component.html',
  styleUrls: ['./popup-dashboard-owners.component.scss'],
})
export class PopupDashboardOwnersComponent implements OnInit {
  public owners$: Observable<any[]>;
  public control: FormControl;
  private _destroy$ = new Subject<null>();

  constructor(
    private dialogRef: MatDialogRef<PopupDashboardOwnersComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.owners$ = this.store.pipe(select(selectAllUsersOptions), takeUntil(this._destroy$));
    this.store.dispatch(UserRelated());
    this.control = new FormControl(this.data.selectedOwners);
  }

  ngOnInit(): void {}

  submit() {
    this.dialogRef.close(this.control.value);
  }

  close() {
    this.dialogRef.close(false);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
