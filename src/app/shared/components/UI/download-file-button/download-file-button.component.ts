import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-download-file-button',
  templateUrl: './download-file-button.component.html'
})
export class DownloadFileButtonComponent implements OnInit {
  @Input('delButton') delButton: any = true;
  @Input('downloadButton') downloadButton: any = true;
  @Input('budgeButton') budgeButton: any = true;
  @Input('uploadStatus') uploadStatus = 0;
  @Input() file: any = {
    i: 0,
    caption: 'NDAFile.doc',
    size: '144',
    type: 'doc',
    icon: 'url(\\\'/assets/icons/doc-icons/01-doc-file-icon.png\\\')',
    isError: false
  };
  @Input() marginTop: string = '16px';
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
    this.definiteFileType(this.file.caption);
    this.file.type = this.definiteFileType(this.file.caption);
    this.file.icon = this.setIconByFileType(this.file.type);
  }

  public definiteFileType(filename): any {
    const fileNameArr = filename.split('.');
    return fileNameArr[fileNameArr.length - 1];
  }

  public setIconByFileType(type): any {
    switch (type) {
      case 'docx':
        return 'url(\'/assets/icons/doc-icons/01-doc-file-icon.png\')';
      case 'pptx':
        return 'url(\'/assets/icons/doc-icons/06-ppt-file-icon.png\')';
      case 'pdf':
        return 'url(\'/assets/icons/doc-icons/03-pdf-file-icon.png\')';
      case 'xlsx':
        return 'url(\'/assets/icons/doc-icons/04-xls-file-icon.png\')';
      case 'rar':
        return 'url(\'/assets/icons/doc-icons/07-rar-file-icon.png\')';
      default:
        return 'url(\'/assets/icons/doc-icons/02-docx-file-icon.png\')';
    }
  }

  public removeComponent(i): void {
    this.delete.emit(i);
  }
}
