export interface IDatabaseUploadCsvData {
  table_name: string;
  csv_file: string;
  database: string;
  schema: string;
  delimiter: string;
  if_exists: string;
  header_row: string;
  index_col: string;
  mangle_dupe_cols: boolean;
  skip_initial_space: boolean;
  decimal: string;
  index_label: string;
  parse_dates: string;
  dataframe_index: boolean;
  null_values: string;
}

export interface IDatabaseUploadExcelData {
  table_name: string;
  excel_file: string;
  sheet_name: string;
  database: string;
  schema: string;
  if_exists: string;
  header_row: string;
  index_col: string;
  mangle_dupe_cols: boolean;
  dataframe_index: boolean;
  decimal: string;
  parse_dates: string;
  index_label: string;
  null_values: string;
}
