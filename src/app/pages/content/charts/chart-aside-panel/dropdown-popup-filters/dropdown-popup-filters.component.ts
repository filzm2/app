import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ChipsAutocompleteFieldComponent} from "@shared/components/chips-autocomplete-field/chips-autocomplete-field.component";
import {pairwise} from "rxjs/operators";

@Component({
  selector: 'app-dropdown-popup-filters',
  templateUrl: './dropdown-popup-filters.component.html',
  styleUrls: ['./dropdown-popup-filters.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DropdownPopupFiltersComponent implements OnInit, AfterViewInit {

  @ViewChild(ChipsAutocompleteFieldComponent) public optionsInput: ChipsAutocompleteFieldComponent;
  public formGroup: FormGroup;
  public availableMetrics: any[];
  public availableColumns: any[];
  public selectedIndex: number = 0;
  public availableOptions: any[] = [];
  private item: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DropdownPopupFiltersComponent>,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    console.log('open', this.data);
    this.availableMetrics = this.data.dataset.metrics;
    this.availableColumns = this.data.dataset.columns;
    const metric = this.data.event?.value
    if (metric && typeof metric === 'string') {
      this.item = this.availableMetrics.find(item => item.metric_name === metric);
    }

    if (metric && (metric?.verbose_name || metric?.label)) {
      this.item = metric;
    }

    const filter = this.data?.event?.value;
    this.selectedIndex = (filter?.expressionType === 'SIMPLE' || typeof filter?.expressionType === 'undefined') ? 0 : 1;
    this.availableOptions = Array.isArray(filter?.comparator) ? filter?.comparator : [];
    this.formGroup = this.fb.group({

      clause: filter?.clause ?? 'WHERE',
      comparator: [filter?.comparator ?? []],
      expressionType: filter?.expressionType ?? 'SIMPLE',
      filterOptionName: filter?.filterOptionName ?? '',
      isExtra: filter?.isExtra ?? false,
      isNew: filter?.isNew ?? false,
      operator: filter?.operator ?? '',
      operatorId: filter?.operatorId ?? '',
      sqlExpression: filter?.sqlExpression ?? null,
      subject: filter?.subject ?? '',

    });
  }

  public ngAfterViewInit() {
    this.optionsInput.inputControl.valueChanges.pipe(pairwise()).subscribe((value) => {
      if (value[0] === value[1] || value[1] === null) {
        return;
      }
      setTimeout(() => {
        const copy = [...this.availableOptions];
        copy.push(value[1]);
        this.availableOptions = copy;
      });
    });
  }

  public submit(): void {
    let columnLabel = '';
    this.availableColumns.forEach(i => {
      if (i.id === this.formGroup.value.column) {
        columnLabel = i.column_name;
      }
    });

    this.dialogRef.close({
      form: {
        ...this.item,
        ...this.formGroup.value,
        operator: this.getOperatorById(this.formGroup.getRawValue().operatorId)
      },
      new: !this.data.event,
      label: columnLabel
    });
  }

  public close(): void {
    this.dialogRef.close();
  }

  public getFormControl(name: string): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  public tabSelect(event: any): void {
    this.formGroup.get('expressionType').setValue(event.index ? 'SQL' : 'SIMPLE');
  }

  public getOperatorById(operatorId: string) {
    switch (operatorId) {
      case 'EQUALS':
        return '==';
      case 'NOT_EQUALS':
        return '!=';
      case 'LESS_THAN':
        return '<';
      case 'GREATER_THAN':
        return '>';
      case 'LESS_THAN_OR_EQUAL':
        return '<=';
      case 'GREATER_THAN_OR_EQUAL':
        return '>=';
      case 'IN':
        return 'IN';
      case 'NOT_IN':
        return 'NOT IN';
      case 'LIKE':
        return 'LIKE';
      case 'LIKE_INSENSITIVE':
        return 'LIKE (case insensitive)';
      case 'IS_NULL':
        return 'IS NULL';
      case 'IS_NOT_NULL':
        return 'IS NOT NULL';
      case 'IS_TRUE':
        return 'IS TRUE';
      case 'IS_FALSE':
        return 'IS FALSE';
    }
  }
}
