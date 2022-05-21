export interface IChartRequest {
  cache_timeout?: 0,
  dashboards?: number[],
  datasource_id: 0,
  datasource_name?: string,
  datasource_type?: 'druid' | 'table',
  description?: string,
  owners?: number[],
  params?: string,
  query_context?: string,
  query_context_generation?: true,
  slice_name: string,
  viz_type: string,
}

export type IChartListRequest = {
  columns?: string[];
  filters?: string[];
  keys?: string[];
  order_direction?: string;
  page?: string;
  page_size?: string;
}

export interface IChartRelatedRequest {

}

export interface IChartListDeleteRequest {

}

export interface IChartImportRequest {

}
