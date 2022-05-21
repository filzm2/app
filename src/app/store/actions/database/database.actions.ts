import { createAction, props } from '@ngrx/store';
import { IAvailableData, IDatabase } from '@models/database/database.model';
import { IListResponse } from '@models/list/list-response.model';
import { IItemResponse } from '@models/list/item-response.model';
import { IDatabaseSettings } from '@models/database/database-settings.model';
import { IDatabaseValidationData } from '@models/database/database-validation.model';

export const DatabaseListGet = createAction('[DATABASE] List Get', props<{payload: any}>());
export const DatabaseListGetSuccess = createAction('[DATABASE] List Get -> Success', props<{payload: IListResponse<IDatabase>}>());
export const DatabaseListGetError = createAction('[DATABASE] List Get -> Error', props<{payload: any}>());
export const DatabaseListClear = createAction('[DATABASE] List Clear');

export const DatabaseAvailableGet = createAction('[DATABASE] Available Get');
export const DatabaseAvailableGetSuccess = createAction('[DATABASE] Available Get -> Success', props<{payload: { databases: IAvailableData[] }}>());
export const DatabaseAvailableGetError = createAction('[DATABASE] Available Get -> Error', props<{payload: any}>());

export const DatabaseTestConnection = createAction('[DATABASE] Test Connection', props<{payload: { data: any } }>());
export const DatabaseTestConnectionSuccess = createAction('[DATABASE] Test Connection -> Success', props<{payload: any}>());
export const DatabaseTestConnectionError = createAction('[DATABASE] Test Connection -> Error', props<{payload: any}>());

export const DatabaseGet = createAction('[DATABASE] Get', props<{payload: number}>());
export const DatabaseGetSuccess = createAction('[DATABASE] Get -> Success', props<{payload: IItemResponse<IDatabaseSettings>}>());
export const DatabaseGetError = createAction('[DATABASE] Get -> Error', props<{payload: any}>());
export const DatabaseClear = createAction('[DATABASE] Clear');

export const DatabaseSave = createAction('[DATABASE] Save', props<{payload: { data: IDatabaseSettings, id: number }}>());
export const DatabaseSaveSuccess = createAction('[DATABASE] Save -> Success');
export const DatabaseSaveError = createAction('[DATABASE] Save -> Error', props<{payload: any}>());

export const DatabaseGetInfo = createAction('[DATABASE] Get Info', props<{payload: { keys: string[]}}>());
export const DatabaseGetInfoSuccess = createAction('[DATABASE] Get Info -> Success', props<{payload: {permissions: string[]}}>());
export const DatabaseGetInfoError = createAction('[DATABASE] Get Info -> Error', props<{payload: any}>());

export const DatabaseDelete = createAction('[DATABASE] Delete', props<{payload: number}>());
export const DatabaseDeleteSuccess = createAction('[DATABASE] Delete -> Success', props<{payload: any}>());
export const DatabaseDeleteError = createAction('[DATABASE] Delete -> Error', props<{payload: any}>());

export const DatabaseValidateParameters = createAction('[DATABASE] Validate Parameters', props<{payload: IDatabaseValidationData}>());
export const DatabaseValidateParametersSuccess = createAction('[DATABASE] Validate Parameters -> Success', props<{payload: any}>());
export const DatabaseValidateParametersError = createAction('[DATABASE] Validate Parameters -> Error', props<{payload: any}>());

export const DatabaseCreateWithForm = createAction('[DATABASE] Create With Form', props<{payload: IDatabaseValidationData}>());
export const DatabaseCreateWithFormSuccess = createAction('[DATABASE] Create With Form -> Success', props<{payload: any}>());
export const DatabaseCreateWithFormError = createAction('[DATABASE] Create With Form -> Error', props<{payload: any}>());

export const DatabaseCreate = createAction('[DATABASE] Create', props<{payload: IDatabaseSettings}>());
export const DatabaseCreateSuccess = createAction('[DATABASE] Create -> Success', props<{payload: any}>());
export const DatabaseCreateError = createAction('[DATABASE] Create -> Error', props<{payload: any}>());
export const DatabaseCreateClear = createAction('[DATABASE] Create Clear');

export const DatabaseGetRelatedObjects = createAction('[DATABASE] Get Related Objects', props<{payload: number}>());
export const DatabaseGetRelatedObjectsSuccess = createAction('[DATABASE] Get Related Objects -> Success', props<{payload: any}>());
export const DatabaseGetRelatedObjectsError = createAction('[DATABASE] Get Related Objects -> Error', props<{payload: any}>());

export const UploadCSV = createAction('[DATABASE] Upload CSV', props<{payload: any}>());
export const UploadCSVSuccess = createAction('[DATABASE] Upload CSV -> Success', props<{payload: any}>());
export const UploadCSVError = createAction('[DATABASE] Upload CSV -> Error', props<{payload: any}>());

export const UploadExcel = createAction('[DATABASE] Upload Excel', props<{payload: any}>());
export const UploadExcelSuccess = createAction('[DATABASE] Upload Excel -> Success', props<{payload: any}>());
export const UploadExcelError = createAction('[DATABASE] Upload Excel -> Error', props<{payload: any}>());

export const DatabasesCSV = createAction('[DATABASE] Databases CSV');
export const DatabasesCSVSuccess = createAction('[DATABASE] Databases CSV -> Success', props<{payload: any}>());
export const DatabasesCSVError = createAction('[DATABASE] Databases CSV -> Error', props<{payload: any}>());

export const DatabasesExcel = createAction('[DATABASE] Databases Excel');
export const DatabasesExcelSuccess = createAction('[DATABASE] Databases Excel -> Success', props<{payload: any}>());
export const DatabasesExcelError = createAction('[DATABASE] Databases Excel -> Error', props<{payload: any}>());

export const GetSchemasForCSV = createAction('[DATABASE] Get Schemas For CSV', props<{payload: number}>());
export const GetSchemasForCSVSuccess = createAction('[DATABASE] Get Schemas For CSV -> Success', props<{payload: any}>());
export const GetSchemasForCSVError = createAction('[DATABASE] Get Schemas For CSV -> Error', props<{payload: any}>());

export const GetSchemasForExcel = createAction('[DATABASE] Get Schemas For Excel', props<{payload: number}>());
export const GetSchemasForExcelSuccess = createAction('[DATABASE] Get Schemas For Excel -> Success', props<{payload: any}>());
export const GetSchemasForExcelError = createAction('[DATABASE] Get Schemas For Excel -> Error', props<{payload: any}>());

export const DatabaseUploadClear = createAction('[DATABASE] Upload Clear');
