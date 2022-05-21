import {Directive, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {Subject} from "rxjs";
import {DatasetService} from "@page/content/dataset/services/dataset.service";
import {takeUntil} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";

@Directive()
export abstract class AbstractChartSettingsComponent implements OnInit, OnDestroy {

  abstract formGroup: FormGroup;
  abstract multipleOptionsFieldsState: any;
  protected _destroy$: Subject<null>;
  protected datasetService: DatasetService;
  protected dialog: MatDialog;
  @Input('chartData') protected chartData: any;
  @Input('datasetData') protected datasetData: any;
  @Input('currentTab') public currentTab: 'data' | 'customize';
  @Output('submit') submit: EventEmitter<any> = new EventEmitter<any>();
  protected constructor(injector: Injector) {
    this.datasetService = injector.get(DatasetService);
    this.dialog = injector.get(MatDialog);
    this._destroy$ = new Subject<null>();
    this.datasetService.saveChartSubject$.pipe(takeUntil(this._destroy$)).subscribe(bool => {
      if (bool) {
        this.save();
        return;
      }
      this.run();
    });
  }

  protected save(res?: any): void {
    res.save = true;
    this.submit.emit(res);
  }

  protected run(res?: any): void {
    this.submit.emit(res);
  }

  protected addClick(event: PointerEvent, key: string) {
  }

  protected itemClick(event: { event: PointerEvent, item: any }, key: string, index: number): void {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
