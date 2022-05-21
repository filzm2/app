import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/material-imports.module';
import { LoginComponent } from './login/login.component';
import {  FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
