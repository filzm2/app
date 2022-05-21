import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface IOption {
  text: string;
  value: any;
  id?: any;
}

@Component({
  selector: 'app-chips-autocomplete-field',
  templateUrl: './chips-autocomplete-field.component.html',
  styleUrls: ['./chips-autocomplete-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipsAutocompleteFieldComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ChipsAutocompleteFieldComponent
  implements ControlValueAccessor, OnChanges, AfterViewInit
{
  @Input() public label: any;
  @Input() public allOptions: IOption[] | string[];
  @Output() public select = new EventEmitter();
  @ViewChild('input') public input: ElementRef<HTMLInputElement>;

  public selectable = true;
  public removable = true;
  public filteredItems: Observable<IOption[]>;
  public options: IOption[] = [];
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public inputControl = new FormControl();
  public isAutocompliteShown = false;

  private control: NgControl;
  private propagateChange = (arr: any[]) => {};
  private propagateTouch = (arr: any[]) => {};

  constructor(private injector: Injector) {
    this.filteredItems = this.inputControl.valueChanges.pipe(
      map((option: string | null) => {
        return option ? this.filter(option) : this.filter('');
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const allOptions = changes.allOptions?.currentValue;
    if (!Array.isArray(allOptions) || !allOptions.length) {
      return;
    }
    this.allOptions = this.formatOptions(allOptions);
    this.setInitValue();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setInitValue();
    });
  }

  public writeValue(arr: IOption[]): void {
    const value = Array.isArray(arr) ? arr.map((item) => item?.value || item?.id || item) : [];
    this.propagateChange(value);
    this.propagateTouch(value);
  }

  public registerOnChange(fn: () => any[]): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(fn: () => any[]): void {
    this.propagateTouch = fn;
  }

  public remove(item: IOption): void {
    const index = this.options.indexOf(item);

    if (index >= 0) {
      this.options.splice(index, 1);
    }
    this.inputControl.setValue(null);
    this.writeValue(this.options);
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    this.options.push({ value: event.option.value, text: event.option.viewValue });
    this.input.nativeElement.value = '';
    this.inputControl.setValue(null);
    this.writeValue(this.options);
    this.select.emit(this.options);
  }

  public clear(): void {
    this.options = [];
    this.inputControl.setValue(null);
  }

  private setInitValue() {
    this.control = this.injector.get(NgControl);
    const initValue = this.control?.control?.value;

    if (Array.isArray(initValue)) {
      this.options = initValue
        .map((item) => {
          if (typeof item === 'number' || typeof item === 'string') {
            return (this.allOptions as IOption[]).find((option) => option.value === item);
          }
          return (this.allOptions as IOption[]).find((option) => option.value === item.id);
        })
        .filter((item: any) => {
          return !!item || item === 0;
        });
    }
    this.inputControl.setValue(null);
    setTimeout(() => this.inputControl.setValue(null));
  }

  private filter(value: string): IOption[] {
    const filterValue = value.toString().toLowerCase();
    return (this.allOptions as IOption[])
      .filter((item) => item.text.toLowerCase().includes(filterValue))
      .filter((item) => {
        return !this.options.some((selected) => item.value === selected.value);
      });
  }

  private formatOptions(options: any[]): IOption[] {
    if (typeof options[0] === 'string') {
      return options.map((option) => {
        return {
          text: option,
          value: option,
          id: option,
        };
      });
    }
    if (options[0]?.text && options[0]?.id && !options[0]?.value) {
      return options.map((option) => {
        return {
          ...option,
          value: option.id,
        };
      });
    }
    return options as IOption[];
  }

  public toggleOpenPanel(trigger): void {
    if (this.isAutocompliteShown) {
      this.isAutocompliteShown = false;
      trigger.closePanel();
    } else {
      this.isAutocompliteShown = true;
      trigger.openPanel();
    }
  }
}
