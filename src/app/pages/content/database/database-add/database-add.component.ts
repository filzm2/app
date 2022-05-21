import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import {
  selectDatabaseAvailableState,
  selectDatabaseState,
} from '@store/selectors/database/database.selector';
import {
  DatabaseAvailableGet,
  DatabaseClear,
  DatabaseCreateClear,
} from '@store/actions/database/database.actions';
import { Subject } from 'rxjs';
import { IAvailableData, IDatabaseProperties } from '@models/database/database.model';
import { FormGroup } from '@angular/forms';
import { DatabaseSqlAlchemyFormComponent } from '@page/content/database/components/database-sql-alchemy-form/database-sql-alchemy-form.component';
import { DatabaseParametersFormComponent } from '@page/content/database/components/database-parameters-form/database-parameters-form.component';
import { DialogService } from '@core/services/dialog.service';
import { Router } from '@angular/router';
import { IDatabaseSettings } from '@models/database/database-settings.model';

@Component({
  selector: 'app-database-add',
  templateUrl: './database-add.component.html',
  styleUrls: ['./database-add.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DatabaseAddComponent implements OnInit, OnDestroy {
  public currentStep = 1;
  public totalStep = 3;
  public currentDescription: string;
  public selectedDatabase: IAvailableData = null;
  public availableParameters = false;
  public availableData: IAvailableData[];
  public properties: IDatabaseProperties;
  public connectMode: 'sql' | 'form' = 'sql';
  public isValidForm = true;
  public data: IDatabaseSettings;
  public databaseId: number;
  public cacheSqlFormValue: any;
  public sqlAlchemyFormGroup: FormGroup;
  private _destroy$ = new Subject<null>();
  private descriptionMap = {
    1: 'Поддерживаемые базы данных',
    2: 'Введите необходимые учетные данные',
    3: 'Дополнительные настройки базы данных',
  };
  private databaseIconMap = {
    'Apache Druid': 'apache-druid',
    'Microsoft SQL Server': 'ms-sql',
    PostgreSQL: 'postgresql',
    MySQL: 'mysql',
    Oracle: 'oracle',
    SQLite: 'sqlite',
    ClickHouse: 'clickhouse',
    default: 'default-database',
  };
  @ViewChild(DatabaseSqlAlchemyFormComponent, { static: false })
  public sqlAlchemyFormComponent: DatabaseSqlAlchemyFormComponent;
  @ViewChild(DatabaseParametersFormComponent, { static: false })
  public parametersFormComponent: DatabaseParametersFormComponent;

  constructor(private store: Store, private dialog: DialogService, private router: Router) {
    this.currentDescription = this.descriptionMap[1];
  }

  ngOnInit(): void {
    this.store
      .pipe(takeUntil(this._destroy$), select(selectDatabaseAvailableState))
      .subscribe((res) => {
        this.availableData = res;
      });
    this.store.pipe(takeUntil(this._destroy$), select(selectDatabaseState)).subscribe((res) => {
      if (res.saveStatus === 'part') {
        this.currentStep = 3;
        this.databaseId = res.data.id;
        if (res.data.result) {
          this.data = { ...res.data.result, engine: this.selectedDatabase.engine };
        }
      }
      if (res.saveStatus === 'success') {
        this.store.dispatch(DatabaseClear());
        this.routeBack();
      }
      this.dialog.errorHandler(res);

      if (res.error) {
        this.store.dispatch(DatabaseCreateClear());
      }
    });

    this.store.dispatch(DatabaseAvailableGet());
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public getDatabaseLogo(name: string): string {
    return this.databaseIconMap[name] ?? this.databaseIconMap.default;
  }

  public getInstruction(): void {}

  public selectDatabase(database: IAvailableData): void {
    this.selectedDatabase = database;
    this.currentStep = 2;
    this.currentDescription = this.descriptionMap[2];

    if (database.parameters) {
      this.availableParameters = true;
      this.properties = database.parameters.properties;
      this.connectMode = 'form';
      return;
    }

    this.totalStep = 2;
  }

  public routeBack(): void {
    this.router.navigate(['/main/database']).then();
  }

  public nextStep(): void {
    if (this.connectMode === 'sql') {
      this.sqlAlchemyFormComponent.saveChanges();
    }
    if (this.currentStep === 3 && this.connectMode === 'form') {
      this.sqlAlchemyFormComponent.saveChanges();
    }
    if (this.currentStep === 2 && this.connectMode === 'form') {
      this.parametersFormComponent.save();

      this.currentDescription = this.descriptionMap[3];
    }
  }

  public toggleConnectMode(): void {
    this.connectMode = this.connectMode === 'sql' ? 'form' : 'sql';
    if (this.connectMode === 'sql') {
      this.isValidForm = true;
      this.totalStep = 2;
      return;
    }
    setTimeout(() => this.parametersFormComponent?.onBlur?.());
    this.cacheSqlFormValue = this.sqlAlchemyFormComponent?.formGroup?.value;
    this.totalStep = 3;
  }

  public validFormHandler(event: boolean): void {
    this.isValidForm = event;
  }

  public needToggleConnectModeButton(): boolean {
    return this.availableParameters && this.currentStep === 2;
  }
}
