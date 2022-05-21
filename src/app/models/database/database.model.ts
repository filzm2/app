export interface IDatabase {
  allow_csv_upload: boolean;
  allow_ctas: boolean;
  allow_cvas: boolean;
  allow_dml: boolean;
  allow_multi_schema_metadata_fetch: boolean;
  allow_run_async: boolean;
  allows_cost_estimate: boolean;
  allows_subquery: boolean;
  allows_virtual_table_explore: boolean;
  backend: string;
  changed_on: string;
  changed_on_delta_humanized: string;
  created_by: null
  database_name: string;
  explore_database_id: number;
  expose_in_sqllab: boolean;
  extra: string;
  force_ctas_schema: string;
  id: number;
}

export interface IAvailableData {
  available_drivers: string[];
  default_driver: string;
  engine: string;
  name: string;
  parameters: {
    properties: IDatabaseProperties;
    required: string[];
    type: string;
  };
  preferred: boolean;
  sqlalchemy_uri_placeholder: string;
}

export interface IDatabaseProperties {
  database?: IDatabaseParameter;
  encryption?: IDatabaseParameter;
  host?: IDatabaseParameter;
  password?: IDatabaseParameter;
  port?: IDatabaseParameter;
  query?: IDatabaseParameter;
  username?: IDatabaseParameter;
  credentials_info?: IDatabaseParameter;
  service_account_info?: IDatabaseParameter;
  catalog?: IDatabaseParameter;
  display_name?: IDatabaseParameter;
};

interface IDatabaseParameter {
  description?: string;
  format?: string;
  maximum?: number;
  minimum?: number;
  type?: string;
}

export interface IDatabaseRelatedObjects {
  charts: IRelatedData,
  dashboards: IRelatedData,
}

interface IRelatedData {
  count: number,
  result: any[],
}
