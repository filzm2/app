import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface DialogData {
  id: number;
  name: string;
  status: string;
}

@Component({
  selector: 'app-popup-process',
  templateUrl: './popup-process.component.html',
  styleUrls: ['./popup-process.component.scss']
})
export class PopupProcessComponent implements OnInit {

  formProcess: FormGroup;
  statuses = [ 'Новый', 'В работе' ];

  constructor(
    public dialogRef: MatDialogRef<PopupProcessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.createForm();
    if (this.data.name) {
      this.formPatcher(this.data);
    }
  }

  createForm(): void {
    this.formProcess = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      status: ['', Validators.required],
      arrow: ['']
    });
  }

  formPatcher(data): void {
    this.formProcess.patchValue({ ...data });
  }

  onCancelClick(): void {
    this.dialogRef.close({event: 'cancel'});
  }

  onConfirmClick(): void {
    const formData = {...this.formProcess.value};
    this.dialogRef.close(formData);
  }

}
