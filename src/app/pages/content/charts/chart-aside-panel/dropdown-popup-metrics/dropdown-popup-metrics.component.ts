import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
  selector: 'app-dropdown-popup-metrics',
  templateUrl: './dropdown-popup-metrics.component.html',
  styleUrls: ['./dropdown-popup-metrics.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DropdownPopupMetricsComponent implements OnInit {

  public formGroup: FormGroup;
  public availableMetrics: any[];
  public availableColumns: any[];
  public selectedIndex: number = 0;
  private item: any;
  public operators = ['AVG', 'COUNT', 'COUNT_DISTINCT', 'MAX', 'MIN', 'SUM'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DropdownPopupMetricsComponent>,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.availableMetrics = this.data.dataset.metrics;
    this.availableColumns = this.data.dataset.columns;
    const metric = this.data.event?.value;
    this.selectedIndex = metric?.expressionType === 'SIMPLE' ? 1 : 2;
    if (this.data.add) {
      this.selectedIndex = 1;
    }
    if (metric && typeof metric === 'string') {
      this.selectedIndex = 0;
      this.item = this.availableMetrics.find(item => item.metric_name === metric);
    }


    if (metric && (metric?.verbose_name || metric?.label)) {
      this.item = metric;
    }
    this.formGroup = this.fb.group({
      metric: this.selectedIndex === 0 ? metric : null,
      column: this.item?.column ?? '',
      expressionType: this.item?.expressionType ?? 'SIMPLE',
      label: this.item?.label ?? '',
      isNew: this.data?.add ?? '',
      aggregate: this.item?.aggregate,
      optionName: this.item?.optionName,
      sqlExpression: null,
      hasCustomLabel: this.item?.hasCustomLabel ?? true,
    });

  }

  submit(): void {
    if (this.selectedIndex === 0) {
      this.dialogRef.close({form: this.formGroup.get('metric'), new: !this.data.event});
    }
    this.dialogRef.close({form: {...this.item, ...this.formGroup.value}, new: !this.data.event});
  }

  public close(): void {
    this.dialogRef.close();
  }

  public tabSelection(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
    this.formGroup.get('expressionType').setValue(event.index === 1 ? 'SIMPLE' : 'SQL');
    if (!(this.selectedIndex === 2)) {
      this.formGroup.get('sqlExpression').setValue(null);
    }
    if (!(this.selectedIndex === 0)) {
      this.formGroup.get('metric').setValue(null);
    }
  }
}
