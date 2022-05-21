import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor'; 
import { AuthService } from './services/auth.service';
import { ChartOptionService } from './services/chart-option.service';
import { ExportCsvService } from './services/export-csv.service';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ShortNumberPipe } from '@app/pipes/short-number.pipe';
import { ManageHttpInterceptor } from './helpers/manage-http.interceptor';
import { HttpCancelService } from './services/http-cancel.service';


@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ManageHttpInterceptor, multi: true },
        AuthService,
        ChartOptionService,
        ExportCsvService,
        HttpCancelService,
        ShortNumberPipe
    ],

})
export class CoreModule { }