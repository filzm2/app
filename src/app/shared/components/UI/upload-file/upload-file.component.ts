import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  @Input('multi') multi: any = false;
  @Input('disabled') disabled: any = false;
  @Input('type') type: 'normal' | 'small' = 'normal' ;
  constructor() { }
  ngOnInit(): void {
  }
}
