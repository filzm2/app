import { IUser } from '@models/user/user.model';

export interface IDatasetListItem {
  changed_by: IUser;
  changed_by_name: string;
  changed_by_url: string;
  changed_on_delta_humanized: string;
  changed_on_utc: string;
  database: {
    database_name: string;
    id: number};
  default_endpoint: string;
  explore_url: string;
  extra: string;
  id: number;
  kind: string;
  owners: IUser[];
  schema: string;
  sql: string;
  table_name: string;
}
