export interface IMetric {
  changed_on: string;
  created_on: string;
  d3format: string;
  description: string;
  expression: string;
  extra: string;
  id: number;
  metric_name: string;
  metric_type: string;
  uuid: string;
  verbose_name: string;
  warning_text: string;
  warning_markdown: string;
  certified_by: string;
  is_certified: boolean;
  certification_details: string;
}
