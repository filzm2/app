import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import * as appState from '@store/reducers';
import {filter, mergeMap, takeUntil} from 'rxjs/operators';
import {IMetric} from '@models/dataset/dataset-metrics.model';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators as v} from '@angular/forms';
import {ITab, ITabButtonSettings} from '@page/content/dataset/dataset.interface';
import {DatasetDeleteMetric, DatasetUpdateClear} from '@store/actions/dataset/dataset.actions';
import {FormService} from '@core/services/form.service';

@Component({
  selector: 'app-dataset-edit-metric',
  templateUrl: './dataset-edit-metric.component.html',
  styleUrls: ['./dataset-edit-metric.component.scss'],
})
export class DatasetEditMetricComponent implements OnInit, OnDestroy, ITab {
  public expanded: number;
  public metrics: IMetric[] = [];
  public tabButtonSettings: ITabButtonSettings = {label: 'Добавить элемент', icon: 'plus'};
  public formGroup: FormGroup;
  public lockDelete: boolean;
  private _destroy$ = new Subject<null>();
  private datasetId: number;


  constructor(
    private router: Router,
    private store: Store<appState.State>,
    private fb: FormBuilder,
    private formService: FormService
  ) {
  }

  public ngOnInit(): void {
    this.store.pipe(
      takeUntil(this._destroy$),
      select('dataset'),
      mergeMap((data: any) => {

        if (data.syncColumns || data.syncColumnsError) {
          return;
        }
        this.datasetId = data?.data?.id;
        this.metrics = data?.data?.result?.metrics || [];
        this.formInit();
        return this.formGroup.valueChanges;
      }),
      filter(data => !!data))
      .subscribe((data: any) => {
      });

    // this.store.pipe(
    //   takeUntil(this._destroy$),
    //   select('datasetUpdate'),
    //   filter((data) => (data.delete === 'metrics')))
    //   .subscribe((data) => {
    //     this.lockDelete = false;
    //     this.getFormArray().removeAt(data.deleteIndex);
    //     this.store.dispatch(DatasetUpdateClear());
    //   });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public formInit(): void {
    const groups: FormGroup[] = [];
    this.metrics.forEach((item) => {
      const extra = JSON.parse(item.extra);
      const group = this.fb.group({
        verbose_name: item.verbose_name,
        description: item.description,
        d3format: [item.d3format, [v.required, v.maxLength(128)]],
        certified_by: extra?.certification?.certified_by,
        certification_details: extra?.certification?.details,
        warning_markdown: extra?.warning_markdown ?? '',
        expression: item.expression,
        id: item.id,
        metric_name: [item.metric_name, [v.required, v.maxLength(255)]],
        metric_type: [item.metric_type, [v.required, v.maxLength(32)]]
      });
      groups.push(group);
    });
    this.formGroup = this.fb.group({
      metrics: this.fb.array([...groups])
    });
  }

  public getFormArray(): FormArray {
    return this.formGroup.get('metrics') as FormArray;
  }

  public addItem(): void {
    this.getFormArray().push(this.fb.group({
      verbose_name: '',
      description: '',
      d3format: ['', [v.required, v.maxLength(128)]],
      certified_by: '',
      certification_details: '',
      warning_markdown: '',
      expression: '',
      id:  null,
      metric_name: ['', [v.required, v.maxLength(255)]],
      metric_type: ['', [v.required, v.maxLength(32)]],
    }));
  }

  public deleteItem(i: number, event: Event): void {
    event.stopPropagation();
    const array = this.getFormArray();
    array.removeAt(i);
  }

  public getControlByName(name: string, group: AbstractControl): FormControl {
    return group.get(name) as FormControl;
  }

  public setStep(id: number): void {
    this.expanded = id;
  }

  public getTabActionCallback(): () => void {
    return () => this.addItem();
  }

  public focusHiddenField(elem: HTMLElement, event: Event): void {
    elem.focus();
    event.stopPropagation();
  }
}
