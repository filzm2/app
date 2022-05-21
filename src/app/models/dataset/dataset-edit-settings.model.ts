import {IColumn} from '@models/dataset/dataset-columns.model';
import {IMetric} from '@models/dataset/dataset-metrics.model';
import {IUser} from '@models/user/user.model';

export interface IDatasetSettings {
  cache_timeout: string;
  columns: IColumn[];
  database: IDatabase;
  datasource_type: string;
  default_endpoint: string;
  description: string;
  extra: string;
  fetch_values_predicate: string;
  filter_select_enabled: boolean;
  id: number;
  is_sqllab_view: boolean;
  main_dttm_col: string;
  metrics: IMetric[];
  offset: number;
  owners: (IUser | number)[];
  schema: string;
  sql: string;
  table_name: string;
  type: string;
  template_params: string;
  url: string;
}

interface IDatabase  {
  database_name: string;
  id: number;
}
