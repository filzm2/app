import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/material-imports.module';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '@app/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StartPageRoutingModule } from './start-page-routing.module';
import { StartPageComponent } from './start-page.component';
import { GridsterModule } from 'angular-gridster2';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [StartPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    MaterialModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    StartPageRoutingModule,
    GridsterModule,
    DragDropModule,
  ],
})
export class StartPageModule {}
