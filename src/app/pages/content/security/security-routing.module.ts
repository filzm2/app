import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from "@page/content/security/users/users.component";
import { UserEditComponent } from "@page/content/security/users/user-edit/user-edit.component";
import { RolesComponent } from "@page/content/security/roles/roles.component";
import { RoleEditComponent } from "@page/content/security/roles/role-edit/role-edit.component";
import { RoleAddComponent } from "@page/content/security/roles/role-add/role-add.component";
import { RowLevelComponent } from "@page/content/security/row-level/row-level.component";
import { RowLevelEditComponent } from "@page/content/security/row-level/row-level-edit/row-level-edit.component";

const routes: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'users/edit/:id', component: UserEditComponent },
  { path: 'users/add', component: UserEditComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'roles/edit/:id', component: RoleEditComponent },
  { path: 'roles/add', component: RoleAddComponent },
  { path: 'row-level', component: RowLevelComponent },
  { path: 'row-level/edit/:id', component: RowLevelEditComponent },
  { path: 'row-level/add', component: RowLevelEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecurityRoutingModule { }
