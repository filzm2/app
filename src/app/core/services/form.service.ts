import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable()
export class FormService {
  private defaultErrorMessage = 'Ошибка валидации: ';
  constructor() {
  }

  public getErrorsByKey(key: string, body: any): string {
    switch (key) {
      case 'required':
        return 'Обязательное поле. ';
      case 'minlength':
        return `Строка на ${body?.requiredLength - body?.actualLength} символов короче минимально допустимого. `;
      case 'maxlength':
        return `Строка на ${body?.actualLength - body?.requiredLength} символов длиннее максимально допустимого. `;
      case 'serverMessage':
        return body;
      case 'unsuitableFile':
        return `Формат ${body?.current} не соответствует ни одному из допустимых: ${body?.availableFormats}. `;
      case 'passwordRepeat':
        return 'Повтор не соответствует паролю. ';
      default:
        return this.defaultErrorMessage + key;
    }
  }

  public getErrorMessage(control: AbstractControl): string {
    return control?.errors ? Object.keys(control.errors).reduce((acc, value, i) => {
      return acc + this.getErrorsByKey(value, control?.errors?.[value]);
    }, '') : '';
  }

  public hasErrors(control: AbstractControl): boolean {
    return control?.errors && !!Object.keys(control.errors).length;
  }
}
