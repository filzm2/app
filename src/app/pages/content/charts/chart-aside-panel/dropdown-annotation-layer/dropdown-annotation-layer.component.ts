import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-dropdown-annotation-layer',
  templateUrl: './dropdown-annotation-layer.component.html',
  styleUrls: ['./dropdown-annotation-layer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DropdownAnnotationLayerComponent  implements OnInit {

  public formGroup: FormGroup;
  private item: any;
  currentType: string;
  public annotationTypes: any[] = [
    // {
    //   value: 'TIME SERIES',
    //   label: 'Временная серия'
    // },
    // {
    //   value: 'INTERVAL',
    //   label: 'Интервал'
    // },
    // {
    //   value: 'EVENT',
    //   label: 'Событие'
    // },
    {
      value: 'FORMULA',
      label: 'Формула'
    },
  ];

  public styles: any[] = [
    {
      value: 'solid',
      label: 'Сплошной'
    },
    {
      value: 'dashed',
      label: 'Пунктир'
    },
    {
      value: 'long_dashed',
      label: 'Длинный пунктир'
    },
    {
      value: 'dotted',
      label: 'Точечный пунктир'
    },
  ];
  public opacities: any[] = [
    {
      value: 'solid',
      label: 'Непрозрачный'
    },
    {
      value: 'opacityLow',
      label: '0.2'
    },
    {
      value: 'opacityMiddle',
      label: '0.5'
    },
    {
      value: 'opacityHigh',
      label: '0.8'
    },
  ];
  public currentColor: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DropdownAnnotationLayerComponent>,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    console.log('open', this.data);

    const layer = this.data?.event?.value;
    this.item = layer;
    this.formGroup = this.fb.group({
      annotationType: layer?.annotationType ?? 'FORMULA',
      color: layer?.color ?? '',
      hideLine: layer?.hideLine ?? false,
      name: layer?.name ?? '',
      opacity: layer?.opacity ?? '',
      overrides: layer?.overrides ?? '',
      show: layer?.show ?? false,
      showMarkers: layer?.showMarkers ?? false,
      sourceType: layer?.sourceType ?? '',
      style: layer?.style ?? 'solid',
      value: layer?.value ?? '',
      width: layer?.width ?? 1,
    });

    this.currentType = layer?.annotationType ?? 'FORMULA';

    this.currentColor = layer?.color.slice?.(1) ?? '000000';

    this.pickColor(this.currentColor);

    this.formGroup.valueChanges.subscribe(res => {
      this.currentType = res.annotationType;
    });
  }

  public submit(): void {

    const rawValue = this.formGroup.getRawValue();
    this.dialogRef.close({
      form: {
        ...this.item,
        ...rawValue,
      },
      new: !this.data.event,
      label: rawValue.name,
    });
  }

  public close(): void {
    this.dialogRef.close();
  }

  public getFormControl(name: string): FormControl {
    return this.formGroup.get(name) as FormControl;
  }

  public pickColor(event: string) {
    this.formGroup.get('color').setValue('#' + event);
  }
}
