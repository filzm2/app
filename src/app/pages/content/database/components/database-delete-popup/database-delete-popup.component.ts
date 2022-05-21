import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { selectDatabaseRelatedObjects } from "@store/selectors/database/database.selector";
import { DatabaseGetRelatedObjects } from "@store/actions/database/database.actions";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-database-delete-popup',
  templateUrl: './database-delete-popup.component.html',
  styleUrls: ['./database-delete-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DatabaseDeletePopupComponent implements OnInit, OnDestroy {
  public chartsCount: number = 0;
  public dashboardsCount: number = 0;
  public formControl = new FormControl('');
  public valid = false;
  private _destroy$ = new Subject<null>();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DatabaseDeletePopupComponent>,
    private store: Store,
  ) {
  }

  ngOnInit(): void {
    this.store.select(selectDatabaseRelatedObjects).subscribe(res => {
      if (res) {
        this.chartsCount = res.charts.count;
        this.dashboardsCount = res.dashboards.count;
      }
    })
    this.store.dispatch(DatabaseGetRelatedObjects({payload: this.data.id}))

    this.formControl.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(value => {
      if(value === 'удалить') {
        this.valid = true;
        return;
      }
      this.valid = false;
    })
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public onCancelClick(): void {
    this.dialogRef.close(false);
  }

  public onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  public getLabel(name: 'chart' | 'dashboard'): string {
    if (name === 'chart') {
      return `${this.chartsCount} ${this.getDeclination(this.chartsCount, ['графике', 'графиках'])}`;
    }
    return `${this.chartsCount} ${this.getDeclination(this.dashboardsCount, ['аналитической панели', 'аналитических панелях'])}`;
  }

  private getDeclination(number: number, forms: [string, string]) {
    const lastDigit = number % 10;

    if (lastDigit === 1 && number !== 11) {
      return forms[0];
    }
    return forms[1];
  }
}
