import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartDetailComponent } from './chart-detail/chart-detail.component';
import { ChartsComponent } from './charts.component';
import { ChartAddComponent } from "./chart-add/chart-add.component";

const routes: Routes =
[{ path: '', component: ChartsComponent, pathMatch: 'full'  },
  { path: 'detail/:id', component: ChartDetailComponent },
  { path: 'add', component: ChartAddComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartsRoutingModule { }
