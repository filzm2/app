import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortNumberPipe } from './pipes/short-number.pipe';
import { IconButtonComponent } from '@shared/components/UI/icon-button/icon-button.component';
import { ChipsAutocompleteFieldComponent } from '@shared/components/chips-autocomplete-field/chips-autocomplete-field.component';
import { PopupWarningComponent } from '@shared/components/popups/popup-warning/popup-warning.component';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { FormService } from '@core/services/form.service';
import { MaterialModule } from '@app/material-imports.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonEditorComponent } from '@shared/components/json-editor/json-editor.component';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { DialogService } from '@core/services/dialog.service';
import { FormFileUploadComponent } from '@shared/components/form-file-upload/form-file-upload.component';
import { SelectInfiniteScrollComponent } from '@shared/components/select-infinite-scroll/select-infinite-scroll.component';
import { MultiSelectPanelComponent } from '@shared/components/multi-select-panel/multi-select-panel.component';
import { TableChartViewComponent } from '@app/shared/components/table-chart/table-chart-view.component';
import { DashboardCardComponent } from './shared/components/dashboard-card/dashboard-card.component';
import { DropdownPopupComponent } from "@page/content/charts/chart-aside-panel/dropdown-popup/dropdown-popup.component";
import { ColorSchemaSelectComponent } from "@shared/components/color-schema-select/color-schema-select.component";


@NgModule({
  declarations: [
    ShortNumberPipe,
    IconButtonComponent,
    ChipsAutocompleteFieldComponent,
    PopupWarningComponent,
    FormFieldComponent,
    JsonEditorComponent,
    FormFileUploadComponent,
    SelectInfiniteScrollComponent,
    MultiSelectPanelComponent,
    DropdownPopupComponent,
    TableChartViewComponent,
    DashboardCardComponent,
    ColorSchemaSelectComponent
  ],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, NgJsonEditorModule],
  exports: [
    ShortNumberPipe,
    IconButtonComponent,
    ChipsAutocompleteFieldComponent,
    PopupWarningComponent,
    FormFieldComponent,
    JsonEditorComponent,
    FormFileUploadComponent,
    SelectInfiniteScrollComponent,
    MultiSelectPanelComponent,
    TableChartViewComponent,
    DashboardCardComponent,
    DropdownPopupComponent,
    ColorSchemaSelectComponent
  ],
  providers: [FormService, DialogService],
})
export class SharedModule {}
