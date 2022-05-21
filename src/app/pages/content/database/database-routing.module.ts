import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatabaseListComponent } from '@page/content/database/database-list/database-list.component';
import { DatabaseEditComponent } from '@page/content/database/database-edit/database-edit.component';
import { DatabaseAddComponent } from '@page/content/database/database-add/database-add.component';
import { DatabaseUploadCsvComponent } from "@page/content/database/database-upload-csv/database-upload-csv.component";
import { DatabaseUploadExcelComponent } from "@page/content/database/database-upload-excel/database-upload-excel.component";

const routes: Routes = [
  { path: '', component: DatabaseListComponent },
  { path: 'edit/:id', component: DatabaseEditComponent },
  { path: 'add', component: DatabaseAddComponent },
  { path: 'upload/csv', component: DatabaseUploadCsvComponent },
  { path: 'upload/excel', component: DatabaseUploadExcelComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatabaseRoutingModule { }
