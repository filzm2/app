import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailingComponent } from './mailing.component';
import { RouterModule } from '@angular/router';
import { MailingRoutingModule } from './mailing-routing.module';
import { MaterialModule } from '@app/material-imports.module';

@NgModule({
  declarations: [MailingComponent],
  imports: [
    CommonModule,
    RouterModule,
    MailingRoutingModule,
    MaterialModule,
  ],
})
export class MailingModule {}
