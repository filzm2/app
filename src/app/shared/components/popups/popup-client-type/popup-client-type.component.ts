import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup-client-type',
  templateUrl: './popup-client-type.component.html',
  styleUrls: ['./popup-client-type.component.scss']
})
export class PopupClientTypeComponent implements OnInit {
  clientType: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) { }

  ngOnInit(): void {
    console.log('Данные, которые пришли в попап: ', this.data);
  }

  public completeTask(): void {
    if (this.clientType === 'ONE_COMPANY') {
      this.router.navigate([`dashboard/client/entity`, this.data.proccess.request_id, this.data.id]);
    } else {
      this.router.navigate([`/dashboard/client/gc`, this.data.proccess.request_id, this.data.id]);
    }
  }
}
