import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ChartsRoutingModule} from './charts-routing.module';
import {ChartsComponent} from './charts.component';
import {ChartDetailComponent} from './chart-detail/chart-detail.component';
import {MaterialModule} from '@app/material-imports.module';

import {NgxEchartsModule} from 'ngx-echarts';
import {SharedModule} from '@app/shared.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DashboardsModule} from "@page/content/dashboards/dashboards.module";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {ChartAddComponent} from './chart-add/chart-add.component';
import {DatasetModule} from "@page/content/dataset/dataset.module";
import {ChartAsidePanelComponent} from './chart-aside-panel/chart-aside-panel.component';
import {NewChartOptionService} from "@core/services/new-chart-option.service";
import {ChartOptionService} from "@core/services/chart-option.service";
import {TableChartComponent} from './chart-aside-panel/charts/table-chart/table-chart.component';
import {LineChartComponent} from './chart-aside-panel/charts/line-chart/line-chart.component';
import {BubbleChartComponent} from './chart-aside-panel/charts/bubble-chart/bubble-chart.component';
import {RadarChartComponent} from './chart-aside-panel/charts/radar-chart/radar-chart.component';
import {TreemapChartComponent} from './chart-aside-panel/charts/treemap-chart/treemap-chart.component';
import {BarChartComponent} from './chart-aside-panel/charts/bar-chart/bar-chart.component';
import {PieChartComponent} from './chart-aside-panel/charts/pie-chart/pie-chart.component';
import {GaugeChartComponent} from './chart-aside-panel/charts/gauge-chart/gauge-chart.component';
import { DropdownPopupComponent } from './chart-aside-panel/dropdown-popup/dropdown-popup.component';
import { DropdownPopupMetricsComponent } from './chart-aside-panel/dropdown-popup-metrics/dropdown-popup-metrics.component';
import { DropdownPopupFiltersComponent } from './chart-aside-panel/dropdown-popup-filters/dropdown-popup-filters.component';
import { DropdownAnnotationLayerComponent } from './chart-aside-panel/dropdown-annotation-layer/dropdown-annotation-layer.component';
import { ColorPickerComponent } from './chart-aside-panel/color-picker/color-picker.component';


@NgModule({
  declarations: [
    ChartsComponent,
    ChartDetailComponent,
    ChartAddComponent,
    ChartAsidePanelComponent,
    TableChartComponent,
    LineChartComponent,
    BubbleChartComponent,
    RadarChartComponent,
    TreemapChartComponent,
    BarChartComponent,
    PieChartComponent,
    GaugeChartComponent,
    DropdownPopupMetricsComponent,
    DropdownPopupFiltersComponent,
    DropdownAnnotationLayerComponent,
    ColorPickerComponent
  ],
  imports: [
    CommonModule,
    ChartsRoutingModule,
    MaterialModule,
    DatasetModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardsModule
  ],
  exports: [
    DropdownPopupComponent
  ],
  providers: [{provide: ChartOptionService, useClass: NewChartOptionService}]
})
export class ChartsModule {
  constructor(public matIconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      'chart_bar',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/graph_bar_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'chart_bubble',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/graph_bubble_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'chart_funnel',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/graph_funnel_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'chart_gauge',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/graph_gauge_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'chart_line',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/graph_line_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'chart_pie',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/graph_pie_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'chart_radar',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/graph_radar_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'chart_sankey',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/graph_sankey_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'chart_table',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/graph_table_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'chart_treemap',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/graph_treemap_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'big_bar',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/big-icon/bar_chart.svg'));
    this.matIconRegistry.addSvgIcon(
      'big_bubble',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/big-icon/bubble_chart.svg'));
    this.matIconRegistry.addSvgIcon(
      'big_funnel',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/big-icon/funnel_chart.svg'));
    this.matIconRegistry.addSvgIcon(
      'big_gauge',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/big-icon/gauge_chart.svg'));
    this.matIconRegistry.addSvgIcon(
      'big_line',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/big-icon/line_chart.svg'));
    this.matIconRegistry.addSvgIcon(
      'big_pie',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/big-icon/pie_chart.svg'));
    this.matIconRegistry.addSvgIcon(
      'big_radar',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/big-icon/radar_chart.svg'));
    this.matIconRegistry.addSvgIcon(
      'big_sankey',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/big-icon/sankey_chart.svg'));
    this.matIconRegistry.addSvgIcon(
      'big_table',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/big-icon/table_chart.svg'));
    this.matIconRegistry.addSvgIcon(
      'big_treemap',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/big-icon/treemap_chart.svg'));
  }
}
