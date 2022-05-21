import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormControl } from "@angular/forms";
import { FormService } from "@core/services/form.service";

@Component({
  selector: 'app-form-file-upload',
  templateUrl: './form-file-upload.component.html',
  styleUrls: ['./form-file-upload.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormFileUploadComponent implements OnInit, AfterViewInit {
  public uploaded = false;
  @Input() public control: FormControl;
  @Input() public availableFormats: string[] = null;
  @Input() public label: string = 'файл';
  @Input() public hint: string;
  @Output() public onUpload = new EventEmitter();
  public fileFormat: string = 'default';
  public fileName: string;
  public fileSize: string;
  public onDrag: boolean;
  public currentFile: File = null;
  public errors: string;
  private svgNameMap = {
    xls: 'xls',
    csv: 'csv',
    default: 'xls',
  }
  @ViewChild('input', {static: false}) private input: ElementRef<HTMLInputElement>;

  constructor(private formService: FormService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

  }

  public onUploadLinkClick(): void {
    this.input.nativeElement.click();
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  public onDropSuccess(event: DragEvent): void {
    event.preventDefault();

    this.onFileChange(event.dataTransfer.files);
  }

  public onChange(event: Event): void {
    this.onFileChange((event.target as HTMLInputElement).files);
  }

  private onFileChange(files: FileList): void {
    if (!files[0]) {
      this.control.setErrors({required: true});
      return;
    }
    if (Array.isArray(this.availableFormats)) {
      const format = FormFileUploadComponent.getFileFormat(files[0].name);
      if (!this.availableFormats.includes(format)) {
        this.control.setErrors({
          unsuitableFile: {
            availableFormats: this.availableFormats,
            current: format,
          }
        });
        return;
      }
    }
    this.uploaded = true;
    this.currentFile = files[0];
    this.fileName = files[0].name;
    this.fileSize = FormFileUploadComponent.getFileSize(files[0].size);
    this.fileFormat = this.getSvgName(files[0].name);
    this.onDrag = false;
    this.onUpload.emit(this.currentFile);
  }

  public clear(): void {
    this.uploaded = false;
    this.currentFile = null;
    this.fileName = null;
    this.fileSize = null;
    this.input.nativeElement.value = '';
    this.fileFormat = 'default';
    this.control.setValue(null);
    this.onUpload.emit(this.currentFile);
  }

  public onDragEnter(): void {
    this.onDrag = true;
  }

  public onDragLeave(): void {
    this.onDrag = false;
  }

  public hasError(): boolean {
    return this.formService.hasErrors(this.control);
  }

  public getErrors(): string {
    return this.formService.getErrorMessage(this.control);
  }

  private getSvgName(fileName: string): string {
    const format = FormFileUploadComponent.getFileFormat(fileName)
    return this.svgNameMap[format] ?? this.svgNameMap.default;
  }

  private static getFileFormat(fileName: string): string {
    const arr = fileName.split('.');
    return arr[arr.length - 1]?.toLowerCase?.();
  }

  private static getFileSize(size: number): string {
    if (size < 1000) {
      return `${size}B`
    }
    if (size < 1000000) {
      const kBites = Math.round(size / 1000);
      return `${kBites}KB`
    }
    if (size < 1000000000) {
      const MBites = Math.round(size / 1000000);
      return `${MBites}MB`
    }
  }
}
