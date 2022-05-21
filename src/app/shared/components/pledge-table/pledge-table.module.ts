import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PledgeTableComponent} from './pledge-table.component';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';



@NgModule({
  declarations: [PledgeTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule
  ],
  exports: [
    PledgeTableComponent
  ]
})
export class PledgeTableModule { }
