import { createAction, props } from '@ngrx/store';

export const DatasetListGet = createAction('[DATASET] List Get', props<{ payload: any }>());
export const DatasetListGetSuccess = createAction('[DATASET] List Get -> Success', props<{ payload: any }>());
export const DatasetListGetError = createAction('[DATASET] List Get -> Error', props<{ payload: any }>());

export const DatasetGet = createAction('[DATASET] Get', props<{ payload: any }>());
export const DatasetGetSuccess = createAction('[DATASET] Get -> Success', props<{ payload: any }>());
export const DatasetGetError = createAction('[DATASET] Get -> Error', props<{ payload: any }>());

export const DatasetCreate = createAction('[DATASET] Create', props<{ payload: any }>());
export const DatasetCreateSuccess = createAction('[DATASET] Create -> Success', props<{ payload: any }>());
export const DatasetCreateError = createAction('[DATASET] Create -> Error', props<{ payload: any }>());
export const DatasetCreateClear = createAction('[DATASET] Create Clear');

// todo: тут экшен удаления, не перепутать, отрефакторить
export const DatasetClear = createAction('[DATASET] Clear', props<{ payload: any }>());
export const DatasetClearSuccess = createAction('[DATASET] Clear -> Success', props<{ payload: any }>());
export const DatasetClearError = createAction('[DATASET] Clear -> Error', props<{ payload: any }>());

export const DatasetOwnersGet = createAction('[OWNERS] List Get', props<{ payload: any }>());
export const DatasetOwnersGetSuccess = createAction('[OWNERS] List Get -> Success', props<{ payload: any }>());
export const DatasetOwnersGetError = createAction('[OWNERS] List Get -> Error', props<{ payload: any }>());
export const DatasetOwnersClear = createAction('[OWNERS] Clear');

export const DatasetDatabasesGet = createAction('[DATABASES] List Get', props<{ payload: any }>());
export const DatasetDatabasesGetSuccess = createAction('[DATABASES] List Get -> Success', props<{ payload: any }>());
export const DatasetDatabasesGetError = createAction('[DATABASES] List Get -> Error', props<{ payload: any }>());
export const DatasetDatabasesClear = createAction('[DATABASES] Clear');

export const DatasetSchemaGet = createAction('[SCHEMA] List by database Get', props<{ payload: any }>());
export const DatasetSchemaGetSuccess = createAction('[SCHEMA] List by database Get -> Success', props<{ payload: any }>());
export const DatasetSchemaGetError = createAction('[SCHEMA] List by database Get -> Error', props<{ payload: any }>());
export const DatasetSchemaClear = createAction('[SCHEMA] Clear');

export const DatasetTablesGet = createAction('[TABLES] List Get', props<{ payload: any }>());
export const DatasetTablesGetSuccess = createAction('[TABLES] List Get -> Success', props<{ payload: any }>());
export const DatasetTablesGetError = createAction('[TABLES] List Get -> Error', props<{ payload: any }>());
export const DatasetTablesClear = createAction('[TABLES] Clear');

export const DatasetTypeGet = createAction('[TYPE] List Get', props<{ payload: any }>());
export const DatasetTypeGetSuccess = createAction('[TYPE] List Get -> Success', props<{ payload: any }>());
export const DatasetTypeGetError = createAction('[TYPE] List Get -> Error', props<{ payload: any }>());
export const DatasetTypeClear = createAction('[TYPE] Clear');

export const DatasetSave = createAction('[UPDATE] Save Put', props<{ payload: any }>());
export const DatasetSaveSuccess = createAction('[UPDATE] Save Put -> Success', props<{ payload: any }>());
export const DatasetSaveError = createAction('[UPDATE] Save Put -> Error', props<{ payload: any }>());
export const DatasetUpdateClear = createAction('[UPDATE] Clear');
// очищает все связанные редьюсеры
export const DatasetUpdateClearHard = createAction('[UPDATE] Clear Hard');

export const DatasetDeleteMetric = createAction('[UPDATE] Metric Delete', props<{ payload: { index: number, metric: number, dataset: number }}>());
export const DatasetDeleteMetricSuccess = createAction('[UPDATE] Metric Delete -> Success', props<{ payload: { index: number }}>());
export const DatasetDeleteMetricError = createAction('[UPDATE] Metric Delete -> Error', props<{ payload: any }>());

export const DatasetDeleteColumn = createAction('[UPDATE] Column Delete', props<{ payload: { index: number, calculated: boolean, column: number, dataset: number  }}>());
export const DatasetDeleteColumnSuccess = createAction('[UPDATE] Column Delete -> Success', props<{ payload: { index: number, calculated: boolean }}>());
export const DatasetDeleteColumnError = createAction('[UPDATE] Column Delete -> Error', props<{ payload: any }>());

export const DatasetAllSchemaGet = createAction('[SCHEMA] List Get');
export const DatasetAllSchemaGetSuccess = createAction('[SCHEMA] List Get -> Success', props<{ payload: any }>());
export const DatasetAllSchemaGetError = createAction('[SCHEMA] List Get -> Error', props<{ payload: any }>());

export const DatasetGetInfo = createAction('[DATASET] Get Info', props<{payload: { keys: string[]}}>());
export const DatasetGetInfoSuccess = createAction('[DATASET] Get Info -> Success', props<{payload: {permissions: string[]}}>());
export const DatasetGetInfoError = createAction('[DATASET] Get Info -> Error', props<{payload: any}>());

export const DatasetSyncColumns = createAction('[DATASET] Sync Columns', props<{payload: any}>());
export const DatasetSyncColumnsSuccess = createAction('[DATASET] Sync Columns -> Success', props<{payload: any}>());
export const DatasetSyncColumnsError = createAction('[DATASET] Sync Columns -> Error', props<{payload: any}>());
export const DatasetSyncColumnsClear = createAction('[DATASET] Sync Columns -> Error');
