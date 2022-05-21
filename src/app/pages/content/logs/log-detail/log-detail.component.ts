import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

export interface ILogData {
  action: string;
  username: { user: string };
  timestamp: string;
  rest: any;
  dialog?: MatDialog;
}

@Component({
  selector: 'app-log-detail',
  templateUrl: './log-detail.component.html',
  styleUrls: ['./log-detail.component.scss'],
})
export class LogDetailComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public logData: ILogData,
  ) { }

  ngOnInit(): void {
  }

  closePopup(): void {
    this.logData.dialog.closeAll();
  }
}
