// prettier-ignore
import { createAction, props } from '@ngrx/store';
import {
  IChartListDeleteRequest,
  IChartListRequest,
  IChartRelatedRequest,
  IChartImportRequest,
  IChartRequest
} from '@models/chart/chart-request.model';
import { IChart} from '@models/chart/chart.model';
import { IListResponse } from "@models/list/list-response.model";
import { IChartMSListResponse } from '@app/models/chart/chart-response.model';

export const ChartListGet = createAction('[CHART] Get', props<{payload: any}>());
export const ChartListGetSuccess = createAction('[CHART] Get -> Success', props<{payload: IListResponse<IChart>}>());
export const ChartListGetError = createAction('[CHART] Get -> Error', props<{payload: any}>());

// apiшка из микросервиса
export const ChartListMSGet = createAction('[CHART] MS Get', props<{payload: any}>());
export const ChartListGetMSSuccess = createAction('[CHART] MS Get -> Success', props<{payload: IChartMSListResponse}>());
export const ChartListGetMSError = createAction('[CHART] MS Get -> Error', props<{payload: any}>());

// с помощью этого набора actions можно получить данные для графика с определенными фильтрами
export const ChartDetailDataPost = createAction('[CHART] Detail Data Post', props<{formData: any, body: any}>());
export const ChartDetailDataPostSuccess = createAction('[CHART] Detail Data Post -> Success', props<{payload: any, chartData: any}>());
export const ChartDetailDataPostError = createAction('[CHART] Detail Data Post -> Error', props<{payload: any, chartData: any}>());

export const ChartDataGetCacheKey = createAction('[CHART] Data Cache Key', props<{cacheKey: string}>());
export const ChartDataGetCacheKeySuccess = createAction('[CHART] Data Cache Key -> Success', props<{payload: any}>());
export const ChartDataGetCacheKeyError = createAction('[CHART] Data Cache Key -> Error', props<{payload: any}>());

export const ChartDetailGet = createAction('[CHART] Detail Get', props<{id: string, q: any}>());
export const ChartDetailGetSuccess = createAction('[CHART] Detail Get -> Success', props<{payload: IChart}>());
export const ChartDetailGetError = createAction('[CHART] Detail Get -> Error', props<{payload: any}>());

// этот набор actions используется для получения данных, по которым график был сохранен в интерфейсе графиков
export const ChartDetailDataGet = createAction('[CHART] Detail Data Get', props<{id: string, q: any}>());
export const ChartDetailDataGetSuccess = createAction('[CHART] Detail Data Get -> Success', props<{payload: IChart, id: string}>());
export const ChartSaveDetailDataGetSuccess = createAction('[CHART] Detail Data Save Get -> Success', props<{payload: IChart}>());
export const ChartDetailDataGetError = createAction('[CHART] Detail Data Get -> Error', props<{payload: any}>());

// actions для скачивания CSV
export const ChartDetailDataGetCSV = createAction('[CHART] Detail Data Get CSV', props<{id: string, name: string }>());
export const ChartDetailDataGetCSVSuccess = createAction('[CHART] Detail Data Get CSV -> Success', props<{payload: any, name: string}>());
export const ChartDetailDataGetCSVError = createAction('[CHART] Detail Data Get CSV -> Error', props<{payload: any}>());

export const ChartDetailUpdate = createAction('[CHART] Detail Update', props<{id: string, payload: any}>());
export const ChartDetailUpdateSuccess = createAction('[CHART] Detail Update -> Success', props<{payload: any}>());
export const ChartDetailUpdateError = createAction('[CHART] Detail Update -> Error', props<{payload: any}>());

export const ChartRelatedOwners = createAction('[CHART] Related Owners');
export const ChartRelatedOwnersSuccess = createAction('[CHART] Related Owners Success', props<{payload: any}>());
export const ChartRelatedOwnersError = createAction('[CHART] Related Owners Error', props<{payload: any}>());

export const ChartRelatedCreators = createAction('[CHART] Related Creators');
export const ChartRelatedCreatorsSuccess = createAction('[CHART] Related Creators Success', props<{payload: any}>());
export const ChartRelatedCreatorsError = createAction('[CHART] Related Creators Error', props<{payload: any}>());

export const ChartRelatedVizTypes = createAction('[CHART] Related VizTypes');
export const ChartRelatedVizTypesSuccess = createAction('[CHART] Related VizTypes Success', props<{payload: any}>());
export const ChartRelatedVizTypesError = createAction('[CHART] Related VizTypes Error', props<{payload: any}>());

export const ChartRelatedDatasets = createAction('[CHART] Related Datasets', props<{payload: number}>());
export const ChartRelatedDatasetsSuccess = createAction('[CHART] Related Datasets Success', props<{payload: any}>());
export const ChartRelatedDatasetsError = createAction('[CHART] Related Datasets Error', props<{payload: any}>());

export const ChartDelete = createAction('[CHART] Delete', props<{payload: number[]}>());
export const ChartDeleteSuccess = createAction('[CHART] Delete Success', props<{payload: any}>());
export const ChartDeleteError = createAction('[CHART] Delete Error', props<{payload: any}>());

export const ChartGetPermissions = createAction('[CHART] Get Permissions', props<{payload: { keys: string[]}}>());
export const ChartGetPermissionsSuccess = createAction('[CHART] Get Permissions -> Success', props<{payload: {permissions: string[]}}>());
export const ChartGetPermissionsError = createAction('[CHART] Get Permissions -> Error', props<{payload: any}>());

export const ChartGetFavoriteStatus = createAction('[CHART] Get FavoriteStatus', props<{payload: any}>());
export const ChartGetFavoriteStatusSuccess = createAction('[CHART] Get FavoriteStatus -> Success', props<{payload: any}>());
export const ChartGetFavoriteStatusError = createAction('[CHART] Get FavoriteStatus -> Error', props<{payload: any}>());

export const ChartSetFavoriteStatus = createAction('[CHART] Set FavoriteStatus', props<{payload: { select: boolean, data: number[]}}>());
export const ChartSetFavoriteStatusSuccess = createAction('[CHART] Set FavoriteStatus -> Success', props<{payload: any}>());
export const ChartSetFavoriteStatusError = createAction('[CHART] Set FavoriteStatus -> Error', props<{payload: any}>());

export const ChartAddDashboard = createAction('[CHART] Add Dashboard', props<{ payload: any }>());
export const ChartAddDashboardSuccess = createAction('[CHART] Add Dashboard -> Success', props<{ payload: any }>());
export const ChartAddDashboardError = createAction('[CHART] Add Dashboard -> Error',props<{ payload: any }>());

export const ChartDeleteDashboard = createAction('[CHART] Delete Dashboard',props<{ payload: any }>());
export const ChartDeleteDashboardSuccess = createAction('[CHART] Add Dashboard -> Success',props<{ payload: any }>());
export const ChartDeleteDashboardError = createAction('[CHART] Add Dashboard -> Error',props<{ payload: any }>());

export const ChartCreate = createAction('[CHART] Create', props<{payload: {data: any, name: string}}>());
export const ChartCreateSuccess = createAction('[CHART] Create Success', props<{payload: any}>());
export const ChartCreateError = createAction('[CHART] Create Error', props<{payload: any}>());

export const ChartExploreJSONGet = createAction('[CHART] Explore JSON Get', props<{id: string}>());
export const ChartExploreJSONGetSuccess = createAction('[CHART] Explore JSON Get Success', props<{payload: any}>());
export const ChartExploreJSONGetError = createAction('[CHART] Explore JSON Get Error', props<{payload: any}>());

export const ChartExploreJSONPost = createAction('[CHART] Explore JSON Post', props<{ payload: { id: string, body: any } }>());
export const ChartExploreJSONPostSuccess = createAction('[CHART] Explore JSON Post Success', props<{payload: any}>());
export const ChartExploreJSONPostError = createAction('[CHART] Explore JSON Post Error', props<{payload: any}>());

export const ChartExplorePostSave = createAction('[CHART] Explore JSON PostSave', props<{ payload: { id: string, body: any, name: string } }>());

// для запроса графика при редактировании
export const ChartGetFull = createAction('[CHART] Get Full', props<{ payload: { id: string, body: any } }>());
export const ChartGetFullSuccess = createAction('[CHART] Get Full Success', props<{payload: any}>());
export const ChartGetFullError = createAction('[CHART] Get Full Error', props<{payload: any}>());

export const ChartClear = createAction('[CHART] Clear');
