import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseListComponent } from './database-list/database-list.component';
import { MaterialModule } from '@app/material-imports.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared.module';
import { DatabaseRoutingModule } from '@page/content/database/database-routing.module';
import { DatabaseEditComponent } from './database-edit/database-edit.component';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { DatabaseAddComponent } from './database-add/database-add.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DatabaseParametersFormComponent } from './components/database-parameters-form/database-parameters-form.component';
import { DatabaseSqlAlchemyFormComponent } from './components/database-sql-alchemy-form/database-sql-alchemy-form.component';
import { DatabaseConnectionComponent } from './components/database-connection/database-connection.component';
import { DatabaseUploadCsvComponent } from './database-upload-csv/database-upload-csv.component';
import { DatabaseUploadExcelComponent } from './database-upload-excel/database-upload-excel.component';
import { DatabaseDeletePopupComponent } from './components/database-delete-popup/database-delete-popup.component';

@NgModule({
  declarations: [
    DatabaseListComponent,
    DatabaseEditComponent,
    DatabaseAddComponent,
    DatabaseParametersFormComponent,
    DatabaseSqlAlchemyFormComponent,
    DatabaseConnectionComponent,
    DatabaseUploadCsvComponent,
    DatabaseUploadExcelComponent,
    DatabaseDeletePopupComponent
  ],
  imports: [
    CommonModule,
    DatabaseRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgJsonEditorModule
  ]
})
export class DatabaseModule {
  constructor(public matIconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      'mysql',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/database-logo/mysql.svg'));
    this.matIconRegistry.addSvgIcon(
      'apache-druid',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/database-logo/apache-druid.svg'));
    this.matIconRegistry.addSvgIcon(
      'clickhouse',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/database-logo/clickhouse.svg'));
    this.matIconRegistry.addSvgIcon(
      'database-info',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/database-logo/database-info.svg'));
    this.matIconRegistry.addSvgIcon(
      'default-database',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/database-logo/default-database.svg'));
    this.matIconRegistry.addSvgIcon(
      'ms-sql',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/database-logo/ms-sql.svg'));
    this.matIconRegistry.addSvgIcon(
      'oracle',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/database-logo/oracle.svg'));
    this.matIconRegistry.addSvgIcon(
      'postgresql',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/database-logo/postgresql.svg'));
    this.matIconRegistry.addSvgIcon(
      'sqlite',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/database-logo/sqlite.svg'));
  }
}
