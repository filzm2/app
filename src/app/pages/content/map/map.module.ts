import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { RouterModule } from '@angular/router';
import { MapRoutingModule } from './map-routing.module';
import { MaterialModule } from '@app/material-imports.module';

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    RouterModule,
    MapRoutingModule,
    MaterialModule,
  ]
})
export class MapModule { }
