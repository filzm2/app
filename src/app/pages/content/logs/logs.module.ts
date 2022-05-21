import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/material-imports.module';

import { LogsComponent } from './logs.component';
import { LogDetailComponent } from './log-detail/log-detail.component';
import { LogsRoutingModule } from './logs-routing.module';

@NgModule({
  declarations: [
    LogsComponent,
    LogDetailComponent,
  ],
  imports: [
    CommonModule,
    LogsRoutingModule,
    MaterialModule,
  ],
})
export class LogsModule {}
