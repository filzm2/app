import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/material-imports.module';
import { DatasetRoutingModule } from './dataset-routing.module';

import { DatasetComponent } from './dataset.component';
import { DatasetDetailComponent } from './dataset-detail/dataset-detail.component';
import { DatasetAddComponent } from './dataset-add/dataset-add.component';
import { DatasetEditComponent } from './dataset-edit/dataset-edit.component';
import { DatasetEditDatabaseComponent } from './dataset-edit/dataset-edit-tabs/dataset-edit-database/dataset-edit-database.component';
import { DatasetEditMetricComponent } from './dataset-edit/dataset-edit-tabs/dataset-edit-metric/dataset-edit-metric.component';
import { DatasetEditColumnsComponent } from './dataset-edit/dataset-edit-tabs/dataset-edit-columns/dataset-edit-columns.component';
import { DatasetEditSettingsComponent } from '@page/content/dataset/dataset-edit/dataset-edit-tabs/dataset-edit-settings/dataset-edit-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '@core/services/form.service';
import { SharedModule } from '@app/shared.module';
import { DatasetAsidePanelComponent } from './components/dataset-aside-panel/dataset-aside-panel.component';
import { DatasetService } from '@page/content/dataset/services/dataset.service';
import { DatasetListPopupComponent } from './components/dataset-list-popup/dataset-list-popup.component';

@NgModule({
  declarations: [
    DatasetComponent,
    DatasetDetailComponent,
    DatasetAddComponent,
    DatasetEditComponent,
    DatasetEditDatabaseComponent,
    DatasetEditMetricComponent,
    DatasetEditColumnsComponent,
    DatasetEditSettingsComponent,
    DatasetAsidePanelComponent,
    DatasetListPopupComponent,
  ],
  imports: [
    CommonModule,
    DatasetRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [FormService, DatasetService],
  exports: [DatasetAsidePanelComponent],
})
export class DatasetModule {}
