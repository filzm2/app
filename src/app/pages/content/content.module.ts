import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from './content.component';
import { RouterModule } from '@angular/router';
import { ContentRoutingModule } from './content-routing.module';
import { MaterialModule } from '@app/material-imports.module';
import { HeaderComponent } from './header/header.component';
import { HeaderMobileComponent } from './header/header-mobile/header-mobile.component';

@NgModule({
  declarations: [ContentComponent, HeaderComponent, HeaderMobileComponent],
  imports: [CommonModule, RouterModule, ContentRoutingModule, MaterialModule],
})
export class ContentModule {}
