import { Injectable } from '@angular/core';
import { IColumn } from '@models/dataset/dataset-columns.model';
import {ReplaySubject, Subject} from 'rxjs';

@Injectable()
export class DatasetService {
  private columnsTypes: { [key: string]: string } = {};
  public cacheForm: any = null;
  public stateMenuAnimation: 'open' | 'close' = 'open';
  public stateMenuAnimation$: ReplaySubject<'open' | 'close'> = new ReplaySubject<'open' | 'close'>(1);
  public saveChartSubject$: Subject<any> = new Subject();
  public chartTimerSubject$: Subject<boolean> = new Subject<boolean>();
  constructor() {
    this.stateMenuAnimation$.next('open');
  }

  public getColumnTypeIconName(column: IColumn): string {
    const name = this.getColumnLabel(column).toLowerCase().replace(/\s/g, '_');
    const cash = this.columnsTypes[name];
    if (typeof cash === 'string') {
      return cash;
    }
    let colType = '';
    switch (column.type_generic) {
      case 0:
        colType = '#';
        break;
      case 1:
        colType = 'A';
        break;
      case 2:
        colType = 'date-type';
        break;
      case 3:
        colType = 'T/F';
        break;
      case null:
      default:
        colType = '?';
    }
    if (column.expression && column.expression !== column.column_name) {
      colType = 'ƒ';
    }
    this.columnsTypes[name] = colType;
    return colType;
  }

  public getColumnLabel(column: IColumn, verbosePriority = false): string {
    if (verbosePriority) {
      return (column.verbose_name || column.column_name).toString?.();
    }
    return (column.column_name || column.verbose_name).toString?.();
  }

  public getTypeByColumnName(name): string {
    return this.columnsTypes[name];
  }

  public getAsidePanelStateSubject(): ReplaySubject<'open' | 'close'> {
    return this.stateMenuAnimation$;
  }

  public toggleAsideOpen(): void {
    const state = this.stateMenuAnimation === 'open' ? 'close' : 'open';
    this.stateMenuAnimation$.next(state);
    this.stateMenuAnimation = state;
  }
}
