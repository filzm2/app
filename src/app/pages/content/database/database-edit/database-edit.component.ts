import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { selectDatabaseListState, selectDatabaseState } from '@store/selectors/database/database.selector';
import * as appState from '@store/reducers';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { IDatabaseSettings } from '@models/database/database-settings.model';
import { DatabaseCreateClear, DatabaseGet } from '@store/actions/database/database.actions';
import { DatabaseSqlAlchemyFormComponent } from '@page/content/database/components/database-sql-alchemy-form/database-sql-alchemy-form.component';
import { DialogService } from "@core/services/dialog.service";

@Component({
  selector: 'app-database-edit',
  templateUrl: './database-edit.component.html',
  styleUrls: [ './database-edit.component.scss' ],
})
export class DatabaseEditComponent implements OnInit, OnDestroy {

  public databaseId: number;
  public data: IDatabaseSettings;
  @ViewChild(DatabaseSqlAlchemyFormComponent) private sqlAlchemyComponent: DatabaseSqlAlchemyFormComponent;

  private _destroy$ = new Subject<null>();
  constructor(
    private store: Store<appState.State>,
    private router: Router,
    private dialogService: DialogService,
  ) {
  }

  ngOnInit(): void {
    this.store.pipe(takeUntil(this._destroy$), select('router'), take(1))
      .subscribe((router) => this.initStateByUrl(router));

    this.store.pipe(takeUntil(this._destroy$), select(selectDatabaseListState))
      .subscribe((res) => {
        if (res.needUpdate) {
          this.store.dispatch(DatabaseGet({ payload: this.databaseId }));
          this.routeBack();
        }
        this.dialogService.errorHandler(res);
      });

    this.store.pipe(takeUntil(this._destroy$), select(selectDatabaseState))
      .subscribe((res) => {
        if (res.data?.result) {
          this.data = res.data.result;
        }
        this.dialogService.errorHandler(res);
        if (res.error) {
          this.store.dispatch(DatabaseCreateClear());
        }
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private initStateByUrl(router): void {
    this.databaseId = router?.state?.params?.id;
    this.store.dispatch(DatabaseGet({ payload: this.databaseId }));
  }


  public routeBack(): void {
    this.router.navigate([ 'main', 'database' ]).then();
  }

  public saveChanges(): void {
    this.sqlAlchemyComponent.saveChanges();
  }
}
