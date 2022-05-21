import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';

@Component({
  selector: 'app-form-contact-info',
  templateUrl: 'contact-info-form.component.html',
  styleUrls: ['contact-info-form.component.scss']
})
export class ContactInfoFormComponent implements OnInit{
  form: FormGroup;
  userList: any;
  currentUserBadge = null;
  @ViewChild(FormGroupDirective) myForm;

  constructor() {
    this.userList = [
      // {
      //   fullName: 'Жмыщенко Валерий Альбертович',
      //   address: 'г. Москва, ул. Комсомольская, д.71',
      //   document: 'Паспорт РФ 9219 495245',
      //   documentType: 'passport',
      //   bornPlace: 'с. Жамбыл, Казахстан',
      //   birthday: '12.08.1988',
      //   function: 'Бухгалтер',
      // }, {
      //   fullName: 'Ефимов Семен Вениаминович',
      //   address: 'г. Комсомольск, ул. Московская, д.71',
      //   document: 'Паспорт РФ 9219 495245',
      //   documentType: 'passport',
      //   bornPlace: 'с. Мааскантье, Голандия',
      //   birthday: '12.08.1988',
      //   function: 'Кутила',
      // },
    ];
  }

  ngOnInit(): void {
    this.currentUserBadge = this.userList[0];

    this.form = new FormGroup({
      fullName: new FormControl('', Validators.required),
      manager: new FormControl('', Validators.required),
      website: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required)
    });
  }

  badgeClickHandler(tmp: any): void {
    this.currentUserBadge = this.userList[tmp];
  }

  badgeDeleteHandler(key): void {
    this.userList = this.userList.filter( item => item.fullName !== key);
    console.log('delete handler', this.currentUserBadge);
  }

  submitHandler(): void {
    if (this.form.invalid) {
      return;
    }

    this.userList.push({...this.form.value});
    if (this.myForm) {
      this.myForm.resetForm();
    }
  }

}
