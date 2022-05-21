import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardDetailComponent } from './dashboard-detail/dashboard-detail.component';
import { DashboardEditComponent } from './dashboard-edit/dashboard-edit.component';
import { DashboardsComponent } from './dashboards.component';
import { ManagerDashboardComponent } from "@page/content/dashboards/manager-dashboard/manager-dashboard.component";

const routes: Routes = [
  { path: '', component: DashboardsComponent },
  { path: ':id', component: DashboardDetailComponent },
  { path: 'manager/:id', component: ManagerDashboardComponent },
  { path: 'edit/:editId', component: DashboardEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardsRoutingModule {}
