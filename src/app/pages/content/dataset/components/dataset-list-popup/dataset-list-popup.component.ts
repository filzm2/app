import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import * as appState from '@store/reducers';
import { Subject } from 'rxjs';
import { DatasetListGet } from '@store/actions/dataset/dataset.actions';
import { MatTableDataSource } from '@angular/material/table';
import { TDatasetListPopupColumnName } from '@page/content/dataset/components/dataset-list-popup/dataset-list-popup.interface';
import { IDatasetListItem } from '@models/dataset/dataset.model';
import { PopupWarningComponent } from '@shared/components/popups/popup-warning/popup-warning.component';
import { DialogService } from "@core/services/dialog.service";

@Component({
  selector: 'app-dataset-list-popup',
  templateUrl: './dataset-list-popup.component.html',
  styleUrls: ['./dataset-list-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DatasetListPopupComponent implements OnInit {

  public datasetList = new MatTableDataSource();
  public datasetListData: IDatasetListItem[];
  public sortColumn: TDatasetListPopupColumnName = 'table_name';
  public displayedColumns: TDatasetListPopupColumnName[] = ['table_name', 'kind', 'schema', 'database.database_name', 'changed_by_name'];
  public sortOrder: 'asc' | 'desc' = 'asc';
  public isLoading: boolean;
  public warningText = 'Изменение набора данных может привести к поломке диаграммы, если диаграмма основана на столбцах или метаданных, которых нет в целевом наборе данных.';
  public paginator: any = {
    count: 0,
    pageSize: 5,
    currentPage: 0,
    skip: 0
  };
  public filterState = {
    table_name: null,
  };
  private filtersOptions: { [key: string]: { operation: string, column: string } } = {
    table_name: { operation: 'ct', column: 'table_name' },
  };
  private _destroy$ = new Subject<null>();

  constructor(
    public dialogRef: MatDialogRef<DatasetListPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<appState.State>,
    private dialog: MatDialog,
    private dialogService: DialogService,
  ) {
  }

  ngOnInit(): void {

    this.store.pipe(takeUntil(this._destroy$), select('datasetList'))
      .subscribe((res: any) => this.datasetListSubscribe(res));

    this.getDatasetList();
  }

  getDatasetList(): void {
    this.isLoading = true;

    this.store.dispatch(DatasetListGet({
      payload: {
        order_column: this.sortColumn,
        order_direction: this.sortOrder,
        page: this.paginator.currentPage,
        page_size: this.paginator.pageSize,
        filters: this.getFilters(),
      },
    }));
  }

  public datasetListSubscribe(res: any): void {
    if (Array.isArray(res?.data?.result)) {
      const datasetList: IDatasetListItem[] = res.data.result;
      console.log(res.data.result);
      this.datasetList = new MatTableDataSource(datasetList);
      this.datasetListData = datasetList;
      this.paginator.count = res.data.count;
    }
    this.isLoading = false;
    this.dialogService.errorHandler(res);
  }

  public onPageChange(evt: any): void {
    this.paginator.pageSize = evt.pageSize;
    this.paginator.currentPage = evt.pageIndex;
    this.paginator.skip = evt.skip;
    this.getDatasetList();
  }

  public onSearch(search: HTMLInputElement): void {
    this.filterState.table_name = search.value;
    this.paginator.currentPage = 0;
    this.getDatasetList();
  }

  public getSortList(column: TDatasetListPopupColumnName): void {
    if (column === this.sortColumn) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.getDatasetList();
  }

  private getFilters(): any[] {
    const filters = [];
    Object.keys(this.filterState).forEach((key) => {
      if (this.filterState[key] !== null) {
        filters.push({
          col: this.filtersOptions[key].column,
          opr: this.filtersOptions[key].operation,
          value: this.filterState[key],
        });
      }
    });

    return filters;
  }

  public redirectToDataset(row: IDatasetListItem): void {
    const dialog = this.dialog.open(PopupWarningComponent, {
      width: '450px',
      data: {
        title: 'Изменить набор данных',
        text: this.warningText,
        btnSuccessTitle: 'Продолжить',
        btnCancelTitle: 'Отмена'
      }
    });

    dialog.afterClosed().pipe(takeUntil(this._destroy$)).subscribe(res => {
      if (res) {
        this.dialogRef.close({datasetId: row.id});
      }
    });
  }

  public close(): void {
    this.dialogRef.close(false);
  }

}

