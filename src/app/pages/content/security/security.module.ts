import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { SecurityRoutingModule } from "@page/content/security/security-routing.module";
import { MaterialModule } from "@app/material-imports.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared.module";
import { FiltersComponent } from './components/filters/filters.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { RolesComponent } from './roles/roles.component';
import { RoleEditComponent } from './roles/role-edit/role-edit.component';
import { RoleAddComponent } from './roles/role-add/role-add.component';
import { RoleFormComponent } from './roles/role-form/role-form.component';
import { RowLevelComponent } from './row-level/row-level.component';
import { RowLevelEditComponent } from './row-level/row-level-edit/row-level-edit.component';



@NgModule({
  declarations: [
    UsersComponent,
    FiltersComponent,
    UserEditComponent,
    RolesComponent,
    RoleEditComponent,
    RoleAddComponent,
    RoleFormComponent,
    RowLevelComponent,
    RowLevelEditComponent
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class SecurityModule { }
