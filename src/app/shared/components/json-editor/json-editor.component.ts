import { AfterViewInit, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { JsonEditorComponent as Editor, JsonEditorOptions } from 'ang-jsoneditor';
import { FormControl } from '@angular/forms';
import { FormService } from '@core/services/form.service';

@Component({
  selector: 'app-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class JsonEditorComponent implements OnInit, AfterViewInit {
  public options: JsonEditorOptions;
  public focus = false;
  @Input() public control: FormControl;
  @Input() public label: string;
  @Input() public hint: string;
  @Input() public height: 's' | 'm' | 'l' = 's';
  @ViewChild(Editor) private editor: Editor;
  constructor(private formService: FormService) {
    this.options = new JsonEditorOptions();
    this.options.mode = 'code';
    this.options.mainMenuBar = false;
    this.options.statusBar = false;
    this.options.onFocus = () => this.onFocus();
    this.options.onBlur = () => this.onBlur();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  private onFocus(): void {
    this.focus = true;
  }

  private onBlur(): void {
    this.focus = false;
  }

  public getErrors(): string {
    return this.formService.getErrorMessage(this.control);
  }

  public hasError(): boolean {
    return !this.control.valid;
  }
}
