import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DatasetComponent } from './dataset.component';
import { DatasetAddComponent } from './dataset-add/dataset-add.component';
import { DatasetEditComponent } from './dataset-edit/dataset-edit.component';
import { DatasetDetailComponent } from './dataset-detail/dataset-detail.component';

const routes: Routes = [
  { path: '', component: DatasetComponent },
  { path: 'add', component: DatasetAddComponent },
  { path: 'edit', component: DatasetEditComponent },
  { path: 'detail/:id', component: DatasetDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatasetRoutingModule {}
