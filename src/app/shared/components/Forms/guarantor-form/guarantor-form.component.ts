import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';

@Component({
  selector: 'app-guarantor-form',
  templateUrl: 'guarantor-form.component.html',
  styleUrls: ['guarantor-form.component.scss']
})
export class GuarantorFormComponent implements OnInit{
  form: FormGroup;
  @ViewChild(FormGroupDirective) myForm;
  @Output() submitData = new EventEmitter<any>();

  ngOnInit(): void {
    this.form = new FormGroup({
      fio: new FormControl('', Validators.required),
      inn: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
      reason: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      addressFact: new FormControl('', Validators.required),
      docSeries: new FormControl('', Validators.required),
      docNumber: new FormControl('', Validators.required),
      docDate: new FormControl('', Validators.required),
      docPlace: new FormControl('', Validators.required),
    });
  }

  submitHandler(): void {
    this.submitData.emit(this.form.value);
    this.myForm.resetForm();
  }

}
