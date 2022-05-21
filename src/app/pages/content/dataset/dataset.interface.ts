export interface ITabButtonSettings {
  label: string;
  icon: string;
}

export interface ITab {
  getTabActionCallback: () => () => void;
  tabButtonSettings: ITabButtonSettings;
}

export type TColumnName = 'table_name' | 'database.database_name' | 'schema' | 'changed_on_delta_humanized' | 'changed_by.first_name';

export interface ITable {
  title: string;
  label: string;
  value: string;
  type: string;
  schema: string;
}
