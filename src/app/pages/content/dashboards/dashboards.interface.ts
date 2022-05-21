import { IDashboard } from '@models/dashboard/dashboard.model';

export interface IDashboardDatasource extends IDashboard {
  select: boolean;
  favorite: boolean;
  formatOwners: string;
}

export type TDashboardColumnName =
  | 'dashboard_title'
  | 'changed_by.first_name'
  | 'published'
  | 'changed_on_delta_humanized';
export type TViewMode = 'list' | 'tile';
