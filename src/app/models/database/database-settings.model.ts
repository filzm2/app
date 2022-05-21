export interface IDatabaseSettings{
  allow_csv_upload: boolean;
  allow_ctas: boolean;
  allow_cvas: boolean;
  allow_dml: boolean;
  allow_multi_schema_metadata_fetch: boolean;
  allow_run_async: boolean;
  cache_timeout: number;
  configuration_method: string;
  database_name: string;
  encrypted_extra: string;
  engine?: string;
  expose_in_sqllab: boolean;
  extra: string;
  force_ctas_schema: string;
  impersonate_user: boolean;
  parameters?: {[key: string]: any};
  server_cert: string;
  schemas_allowed_for_csv_upload?: string;
  sqlalchemy_uri: string;
}
