import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HoldingCompositionComponent} from './holding-composition.component';
import {SharedModule} from '../../../modules/shared.modules';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    HoldingCompositionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule
  ],
  exports: [
    HoldingCompositionComponent
  ]
})
export class HoldingCompositionModule { }
