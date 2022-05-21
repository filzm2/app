export interface IListResponse<ListModel> {
  count: number;
  description_columns: {[key: string]: string};
  ids: number[];
  label_columns: {[key: string]: string};
  list_columns: string;
  list_title: string;
  order_columns: string[];
  result: ListModel[];
}
