import {IChart} from "@models/chart/chart.model";

export interface IChartDatasource extends IChart{
  select: boolean;
  favorite: boolean;
  changed_on: string;
  last_saved_by_formatted: string;
}

export type TChartColumnName = 'slice_name' | 'viz_type' | 'last_saved_by.first_name' | 'last_saved_at' | 'changed_on_delta_humanized';

export type TChartVizType = 'line' | 'funnel' | 'table' | 'pie' | 'radar' | 'gauge_chart' | 'histogram' | 'bubble' | 'treemap' | 'sankey' | 'dist_bar';
