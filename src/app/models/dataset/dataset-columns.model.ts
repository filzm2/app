export interface IColumn {
  changed_on?: string;
  column_name: string;
  created_on?: string;
  description?: string;
  expression?: string;
  filterable: boolean;
  groupby: boolean;
  id: number | string;
  is_active?: boolean;
  is_dttm: boolean;
  python_date_format?: string;
  type: string;
  type_generic?: number;
  uuid?: string;
  verbose_name?: string;
}
