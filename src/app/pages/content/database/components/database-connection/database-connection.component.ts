import { Component, Input, OnInit } from '@angular/core';
import { DatabaseTestConnection } from "@store/actions/database/database.actions";
import { select, Store } from "@ngrx/store";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { IDatabaseSettings } from "@models/database/database-settings.model";
import { takeUntil } from "rxjs/operators";
import { selectDatabaseState, selectTestConnectionState } from "@store/selectors/database/database.selector";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject } from "rxjs";

@Component({
  selector: 'app-database-connection',
  templateUrl: './database-connection.component.html',
  styleUrls: ['./database-connection.component.scss']
})
export class DatabaseConnectionComponent implements OnInit {

  @Input() public group: FormGroup;
  private _destroy$ = new Subject<null>();
  constructor(private store: Store,
              private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.store.pipe(takeUntil(this._destroy$), select(selectTestConnectionState))
      .subscribe((res) => {
        let message = '';
        if (res?.message) {
          message = res.message === 'OK' ? 'Соединение установлено!' : res.message;
        } else if (res) {
          this.group.markAllAsTouched();
          message = 'Ошибка соединения! Пожалуйста, проверьте данные!';
        }

        if (message) {
          this.snack.open(message, 'x', { horizontalPosition: 'end', duration: 2000 });
        }
      });
  }

  public testConnection(): void {
    const {
      database_name,
      encrypted_extra,
      extra,
      sqlalchemy_uri
    } = this.group.value;

    this.store.dispatch(DatabaseTestConnection({
      payload: {
        data: {
          database_name,
          encrypted_extra: JSON.stringify(encrypted_extra),
          extra,
          sqlalchemy_uri
        }
      }
    }));
  }

  public getFormControl(name: keyof IDatabaseSettings): FormControl {
    return this.getAbstractControl<FormControl>(name);
  }

  public getAbstractControl<Type extends AbstractControl>(name: keyof IDatabaseSettings): Type {
    return this.group?.get(name) as Type;
  }

}
