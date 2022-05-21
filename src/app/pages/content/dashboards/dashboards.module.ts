import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '@app/material-imports.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';

import { NgxEchartsModule } from 'ngx-echarts';
import { GridsterModule } from 'angular-gridster2';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { SharedModule } from '@app/shared.module';
import { ShortNumberPipe } from '@app/pipes/short-number.pipe';

import { DashboardFiltersComponent } from './dashboard-detail/components/dashboard-filters/dashboard-filters.component';
import { DashboardFilterDialogComponent } from './dashboard-detail/components/dashboard-filter-dialog/dashboard-filter-dialog.component';
import { DashboardFilterBarComponent } from './dashboard-detail/components/dashboard-filter-bar/dashboard-filter-bar.component';
import { DashboardsRoutingModule } from './dashboards-routing.module';
import { DashboardsComponent } from './dashboards.component';
import { DashboardDetailComponent } from './dashboard-detail/dashboard-detail.component';
import { DashboardDetailDialogComponent } from './dashboard-detail/dashboard-detail-dialog';
// import { ChartTypeComponent } from './dashboard-create/components/chart-type/chart-type.component';
import { DashboardEditComponent } from './dashboard-edit/dashboard-edit.component';

import {
  CopyLinkDashboardComponent,
  CopyLinkDashboardErrorComponent,
  CopyLinkChartComponent,
  CopyLinkChartErrorComponent,
  EmailSendedComponent,
  EmailSendedErrorComponent,
} from './dashboard-detail/dashboard-detail.component';
import { PopupDashboardOwnersComponent } from '@shared/components/popups/popup-dashboard-owners/popup-dashboard-owners.component';
import { DashboardAutorefreshDialogComponent } from './dashboard-detail/components/dashboard-autorefresh-dialog/dashboard-autorefresh-dialog.component';
import { DashboardCommentBlockComponent } from './dashboard-detail/components/dashboard-comment-block/dashboard-comment-block.component';
import { DashboardCommentComponent } from './dashboard-detail/components/dashboard-comment/dashboard-comment.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { PlanCardComponent } from './manager-dashboard/components/plan-card/plan-card.component';
import { ManagerFiltersComponent } from './manager-dashboard/components/manager-filters/manager-filters.component';
import { ManagerFilterDialogComponent } from './manager-dashboard/components/manager-filter-dialog/manager-filter-dialog.component';
import { ManagerFilterBarComponent } from './manager-dashboard/components/manager-filter-bar/manager-filter-bar.component';
import { DirectorCardComponent } from './manager-dashboard/components/director-card/director-card.component';

import * as echarts from 'echarts/core';
import langRU from 'echarts/lib/i18n/langRU';
echarts.registerLocale("RU", langRU)

@NgModule({
  providers: [ShortNumberPipe],
  declarations: [
    DashboardsComponent,
    DashboardFiltersComponent,
    DashboardFilterDialogComponent,
    DashboardFilterBarComponent,
    DashboardDetailComponent,
    DashboardDetailDialogComponent,
    // ChartTypeComponent,
    DashboardEditComponent,

    CopyLinkDashboardComponent,
    CopyLinkDashboardErrorComponent,
    CopyLinkChartComponent,
    CopyLinkChartErrorComponent,
    EmailSendedComponent,
    EmailSendedErrorComponent,
    PopupDashboardOwnersComponent,
    DashboardAutorefreshDialogComponent,
    DashboardCommentBlockComponent,
    DashboardCommentComponent,
    ManagerDashboardComponent,
    PlanCardComponent,
    ManagerFiltersComponent,
    ManagerFilterDialogComponent,
    ManagerFilterBarComponent,
    DirectorCardComponent,
  ],
  imports: [
    CommonModule,
    DashboardsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    SharedModule,
    DragDropModule,
    OverlayModule,
    GridsterModule,
    MarkdownModule.forChild(),
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          //baseUrl: null,
          breaks: true,
          //extensions: null,
          gfm: true,
          headerIds: true,
          //headerPrefix: '',
          //highlight: null,
          //langPrefix: 'language-',
          //mangle: true,
          //pedantic: false,
          //sanitize: false,
          //sanitizer: null,
          //silent: false,
          smartLists: true,
          smartypants: false,
          //tokenizer: null,
          //walkTokens: null,
          //xhtml: false,
        },
      },
    }),
  ],
  // exports: [],
})
export class DashboardsModule {}
