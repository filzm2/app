import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface DialogData {
  id: number;
  name: string;
}

@Component({
  selector: 'app-popup-process-task',
  templateUrl: './popup-process-task.component.html',
  styleUrls: ['./popup-process-task.component.scss']
})
export class PopupProcessTaskComponent implements OnInit {

  formProcess: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PopupProcessTaskComponent>,
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
      name: ['', Validators.required]
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
