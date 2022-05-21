import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  imports: [
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MatNativeDateModule,
  ],
  exports: [
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MatNativeDateModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
  ]
})
export class MaterialModule {
  constructor(public matIconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    // matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
    this.matIconRegistry.addSvgIcon(
      'delete',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/delete_24px.svg'));
    this.matIconRegistry.addSvgIcon(
      'arrow_drop_down',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/arrow_drop_down_24px.svg'));
    this.matIconRegistry.addSvgIcon(
      'plus',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/plus_24px.svg'));
    this.matIconRegistry.addSvgIcon(
      'pancakes',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/SQL-lab.svg'));
    this.matIconRegistry.addSvgIcon(
      'warning',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/warning_24px.svg'));
    this.matIconRegistry.addSvgIcon(
      'refresh',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/refresh_24px.svg'));
    this.matIconRegistry.addSvgIcon(
      'search',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/search_24px.svg'));
    this.matIconRegistry.addSvgIcon(
      'list',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/new-icons/list.svg'));
    this.matIconRegistry.addSvgIcon(
      'tile',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/new-icons/thum.svg'));
    this.matIconRegistry.addSvgIcon(
      'sort',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/sort_24px.svg'));
    this.matIconRegistry.addSvgIcon(
      'star',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/radio-button/star_unchecked.svg'));
    this.matIconRegistry.addSvgIcon(
      'options',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/options_horizontal_24px.svg'));
    this.matIconRegistry.addSvgIcon(
      'create',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/create_24px.svg'));
    this.matIconRegistry.addSvgIcon(
      'file_upload',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/file_upload_24px.svg'));
    this.matIconRegistry.addSvgIcon(
      'dashboards',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/new-icons/dashboards.svg'));
    this.matIconRegistry.addSvgIcon(
      'charts',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/new-icons/charts.svg'));
    this.matIconRegistry.addSvgIcon(
      'dataset-detail',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/new-icons/dataset-detail.svg'));
    this.matIconRegistry.addSvgIcon(
      'more-vert',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/new-icons/more-vert.svg'));
    this.matIconRegistry.addSvgIcon(
      'date-type',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/new-icons/date-type.svg'));
    this.matIconRegistry.addSvgIcon(
      'unhide',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/unhide_24px.svg'));
    this.matIconRegistry.addSvgIcon(
      'database',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/database_24px.svg'));
    this.matIconRegistry.addSvgIcon(
      'arrow_sort_down',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/arrow_sort_down_24px.svg'));
    this.matIconRegistry.addSvgIcon(
      'virtual',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/new-icons/virtual.svg'));
    this.matIconRegistry.addSvgIcon(
      'physical',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/new-icons/physical.svg'));
    this.matIconRegistry.addSvgIcon(
      'settings',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/settings_24px.svg'));
    this.matIconRegistry.addSvgIcon(
      'csv',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/formats/svg/csv.svg'));
    this.matIconRegistry.addSvgIcon(
      'xls',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/formats/svg/xls.svg'));
    this.matIconRegistry.addSvgIcon(
      'download',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/file_download_24px.svg'));
    this.matIconRegistry.addSvgIcon(
      'close',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/close_24px.svg'));
    this.matIconRegistry.addSvgIcon(
      'graph_bar_icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/badge/graph_bar_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'graph_bubble_icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/badge/graph_bubble_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'graph_gauge_icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/badge/graph_gauge_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'graph_line_icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/badge/graph_line_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'graph_pie_icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/badge/graph_pie_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'graph_radar_icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/badge/graph_radar_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'graph_sankey_icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/badge/graph_sankey_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'graph_table_icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/badge/graph_table_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'graph_treemap_icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/badge/graph_treemap_icon.svg'));
    this.matIconRegistry.addSvgIcon(
      'person',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/person_.svg'));
    this.matIconRegistry.addSvgIcon(
      'preview',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/preview.svg'));
    this.matIconRegistry.addSvgIcon(
      'person_selected',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/person_selected_24px.svg'));
    this.matIconRegistry.addSvgIcon(
      'security',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/security.svg'));
    this.matIconRegistry.addSvgIcon(
      'change',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/change.svg'));
    this.matIconRegistry.addSvgIcon(
      'settings2',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/settings2.svg'));
    this.matIconRegistry.addSvgIcon(
      'play',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/play.svg'));
    this.matIconRegistry.addSvgIcon(
      'comments',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/comments.svg'));
    this.matIconRegistry.addSvgIcon(
      'comments_com',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/badge/comments_com.svg'));
    this.matIconRegistry.addSvgIcon(
      'comments_question',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/badge/comments_question.svg'));
    this.matIconRegistry.addSvgIcon(
      'comments_attention',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/badge/comments_attention.svg'));
    this.matIconRegistry.addSvgIcon(
      'middle-histogram',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/middle-icon/bar.svg'));
    this.matIconRegistry.addSvgIcon(
      'middle-radar',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/middle-icon/radar.svg'));
    this.matIconRegistry.addSvgIcon(
      'middle-table',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/middle-icon/table.svg'));
    this.matIconRegistry.addSvgIcon(
      'middle-sankey',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/middle-icon/sankey.svg'));
    this.matIconRegistry.addSvgIcon(
      'middle-bubble',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/middle-icon/bubble.svg'));
    this.matIconRegistry.addSvgIcon(
      'middle-funnel',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/middle-icon/funnel.svg'));
    this.matIconRegistry.addSvgIcon(
      'middle-treemap',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/middle-icon/treemap.svg'));
    this.matIconRegistry.addSvgIcon(
      'middle-gauge_chart',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/middle-icon/gauge.svg'));
    this.matIconRegistry.addSvgIcon(
      'middle-pie',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/middle-icon/pie.svg'));
    this.matIconRegistry.addSvgIcon(
      'middle-line',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/charts/middle-icon/line.svg'));
    this.matIconRegistry.addSvgIcon(
      'down',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ui-kit/base/down.svg'));

  }
  static forRoot(): ModuleWithProviders<MaterialModule> {
    return {
      ngModule: MaterialModule,
      providers: [MatIconRegistry]
    };
  }
}
