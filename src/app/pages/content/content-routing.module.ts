import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from './content.component';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    children: [
      { path: '', redirectTo: 'start-page', pathMatch: 'full' },
      {
        path: 'start-page',
        loadChildren: () => import('./start-page/start-page.module').then((m) => m.StartPageModule),
      },
      { path: 'home', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule) },
      { path: 'data', loadChildren: () => import('./data/data.module').then((m) => m.DataModule) },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboards/dashboards.module').then((m) => m.DashboardsModule),
      },
      {
        path: 'charts',
        loadChildren: () => import('./charts/charts.module').then((m) => m.ChartsModule),
      },
      { path: 'map', loadChildren: () => import('./map/map.module').then((m) => m.MapModule) },
      {
        path: 'mailing',
        loadChildren: () => import('./mailing/mailing.module').then((m) => m.MailingModule),
      },
      { path: 'logs', loadChildren: () => import('./logs/logs.module').then((m) => m.LogsModule) },
      {
        path: 'dataset',
        loadChildren: () => import('./dataset/dataset.module').then((m) => m.DatasetModule),
      },
      {
        path: 'database',
        loadChildren: () => import('./database/database.module').then((m) => m.DatabaseModule),
      },
      {
        path: 'security',
        loadChildren: () => import('./security/security.module').then((m) => m.SecurityModule),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'service',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentRoutingModule {}
