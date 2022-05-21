import { IChart } from './chart.model';

export interface IChartListResponse {

}

export interface IChartMSListResponse {
    count: number;
    result: IChart[];
}