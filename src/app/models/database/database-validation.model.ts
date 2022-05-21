export interface IDatabaseValidationData {
  configuration_method: string;
  database_name: string;
  encrypted_extra?: string;
  engine: string;
  extra?: string;
  impersonate_user?: boolean;
  parameters: {
    [key: string]: any;
  };
  server_cert?: string;
  catalog?: any[];
  query_input: string;
};
