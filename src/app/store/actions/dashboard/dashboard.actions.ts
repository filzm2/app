import { createAction, props } from '@ngrx/store';
import { IDashboard } from '@models/dashboard/dashboard.model';
import { ISelectItem } from '@store/reducers/dashboard/dashboard-related.reducer';

export const DashboardListGet = createAction('[DASHBOARD] Get', props<{ payload: any }>());
export const DashboardListGetSuccess = createAction(
  '[DASHBOARD] Get -> Success',
  props<{ payload: any }>()
);
export const DashboardListGetError = createAction(
  '[DASHBOARD] Get -> Error',
  props<{ payload: any }>()
);

export const DashboardFavoriteStatusListGet = createAction(
  '[DASHBOARD] Favorite Status List Get',
  props<{ payload: any }>()
);
export const DashboardDetailFavoriteStatusListGet = createAction(
  '[DASHBOARD] Detail Favorite Status List Get',
  props<{ payload: any }>()
);
export const DashboardFavoriteStatusListGetSuccess = createAction(
  '[DASHBOARD] Favorite Status List Get -> Success',
  props<{ payload: any }>()
);
export const DashboardFavoriteStatusListGetError = createAction(
  '[DASHBOARD] Favorite Status List Get -> Error',
  props<{ payload: any }>()
);

export const DashboardDetailGet = createAction(
  '[DASHBOARD] Detail Get',
  props<{ id: string; q: any; callback?: Function }>()
);
export const DashboardDetailGetSuccess = createAction(
  '[DASHBOARD] Detail Get -> Success',
  props<{ payload: IDashboard }>()
);
export const DashboardDetailGetError = createAction(
  '[DASHBOARD] Detail Get -> Error',
  props<{ payload: any }>()
);

export const DashboardDetailChartGet = createAction(
  '[DASHBOARD] Detail Chart Get',
  props<{ id: string }>()
);
export const DashboardDetailChartGetSuccess = createAction(
  '[DASHBOARD] Detail Chart Get -> Success',
  props<{ payload: any }>()
);
export const DashboardDetailChartGetError = createAction(
  '[DASHBOARD] Detail Chart Get -> Error',
  props<{ payload: any }>()
);

export const DashboardDetailPlanGet = createAction('[DASHBOARD] Detail Plan Get');
export const DashboardDetailPlanGetSuccess = createAction(
  '[DASHBOARD] Detail Plan Get -> Success',
  props<{ payload: IDashboard }>()
);
export const DashboardDetailPlanGetError = createAction(
  '[DASHBOARD] Detail Plan Get -> Error',
  props<{ payload: any }>()
);

export const DashboardDetailPlanChartGet = createAction('[DASHBOARD] Detail Plan Chart Get');
export const DashboardDetailPlanChartGetSuccess = createAction(
  '[DASHBOARD] Detail Plan Chart Get -> Success',
  props<{ payload: any }>()
);
export const DashboardDetailPlanChartGetError = createAction(
  '[DASHBOARD] Detail Plan Chart Get -> Error',
  props<{ payload: any }>()
);

export const DashboardCreate = createAction('[DASHBOARD] Create', props<{ payload: any }>());
export const DashboardCreateSuccess = createAction(
  '[DASHBOARD] Create -> Success',
  props<{ payload: IDashboard }>()
);
export const DashboardCreateError = createAction(
  '[DASHBOARD] Create -> Error',
  props<{ payload: any }>()
);

export const DashboardDetailUpdate = createAction(
  '[DASHBOARD] Detail Update',
  props<{ id: string; payload: any }>()
);
export const DashboardDetailUpdateSuccess = createAction(
  '[DASHBOARD] Detail Update -> Success',
  props<{ payload: any }>()
);
export const DashboardDetailUpdateError = createAction(
  '[DASHBOARD] Detail Update -> Error',
  props<{ payload: any }>()
);

export const DashboardGetRelatedOwners = createAction('[DASHBOARD] Related Owners Get');
export const DashboardGetRelatedOwnersSuccess = createAction(
  '[DASHBOARD] Related Owners Get -> Success',
  props<{ payload: { result: ISelectItem[] } }>()
);
export const DashboardGetRelatedOwnersError = createAction(
  '[DASHBOARD] Related Owners Get -> Error',
  props<{ payload: any }>()
);

export const DashboardGetRelatedCreators = createAction('[DASHBOARD] Related Creators Get');
export const DashboardGetRelatedCreatorsSuccess = createAction(
  '[DASHBOARD] Related Creators Get -> Success',
  props<{ payload: { result: ISelectItem[] } }>()
);
export const DashboardGetRelatedCreatorsError = createAction(
  '[DASHBOARD] Related Creators Get -> Error',
  props<{ payload: any }>()
);

export const DashboardDelete = createAction('[DASHBOARD] Delete', props<{ payload: any }>());
export const DashboardMultipleDelete = createAction(
  '[DASHBOARD] Multiple Delete',
  props<{ payload: any }>()
);
export const DashboardDeleteSuccess = createAction(
  '[DASHBOARD] Delete -> Success',
  props<{ payload: any }>()
);
export const DashboardDeleteError = createAction(
  '[DASHBOARD] Delete -> Error',
  props<{ payload: any }>()
);

export const DashboardExport = createAction('[DASHBOARD] Export', props<{ payload: number[] }>());
export const DashboardExportSuccess = createAction(
  '[DASHBOARD] Export -> Success',
  props<{ payload: { result: string } }>()
);
export const DashboardExportError = createAction(
  '[DASHBOARD] Export -> Error',
  props<{ payload: any }>()
);

export const DashboardGetPins = createAction('[DASHBOARD] Get Pins');
export const DashboardGetPinsSuccess = createAction(
  '[DASHBOARD] Get Pins -> Success',
  props<{ payload: any }>()
);
export const DashboardGetPinsError = createAction(
  '[DASHBOARD] Get Pins -> Error',
  props<{ payload: any }>()
);

export const DashboardPin = createAction(
  '[DASHBOARD] Pin',
  props<{ payload: { id: number; isPin: boolean; callback?: Function } }>()
);
export const DashboardPinSuccess = createAction(
  '[DASHBOARD] Pin -> Success',
  props<{ payload: { result: string } }>()
);
export const DashboardPinError = createAction(
  '[DASHBOARD] Pin -> Error',
  props<{ payload: any }>()
);

export const DashboardsOrder = createAction('[DASHBOARD] Order', props<{ payload: any }>());
export const DashboardsOrderSuccess = createAction(
  '[DASHBOARD] Order -> Success',
  props<{ payload: any }>()
);
export const DashboardsOrderError = createAction(
  '[DASHBOARD] Order -> Error',
  props<{ payload: any }>()
);

export const DashboardsOrdersGet = createAction(
  '[DASHBOARD] Orders Get',
  props<{ payload: { callback: Function } }>()
);
export const DashboardsOrdersGetSuccess = createAction(
  '[DASHBOARD] Orders Get -> Success',
  props<{ payload: any }>()
);
export const DashboardsOrdersGetError = createAction(
  '[DASHBOARD] Orders Get -> Error',
  props<{ payload: any }>()
);

export const DashboardViewed = createAction('[DASHBOARD] Viewed', props<{ id: number }>());
export const DashboardViewedSuccess = createAction(
  '[DASHBOARD] Viewed -> Success',
  props<{ payload: { result: string } }>()
);
export const DashboardViewedError = createAction(
  '[DASHBOARD] Viewed -> Error',
  props<{ payload: any }>()
);

export const DashboardGetInfo = createAction(
  '[DASHBOARD] Get Info',
  props<{ payload: { keys: string[] } }>()
);
export const DashboardGetInfoSuccess = createAction(
  '[DASHBOARD] Get Info -> Success',
  props<{ payload: { permissions: string[] } }>()
);
export const DashboardGetInfoError = createAction(
  '[DASHBOARD] Get Info -> Error',
  props<{ payload: any }>()
);

export const DashboardSetFavoriteStatus = createAction(
  '[DASHBOARD] Set Favorite Status Info',
  props<{ payload: { select: boolean; data: number[]; callback?: Function } }>()
);
export const DashboardSetFavoriteStatusSuccess = createAction(
  '[DASHBOARD] Set FavoriteStatus -> Success',
  props<{ payload: any }>()
);
export const DashboardSetFavoriteStatusError = createAction(
  '[DASHBOARD] Set Favorite Status -> Error',
  props<{ payload: any }>()
);

export const DashboardClear = createAction('[DASHBOARD] Clear');
export const DashboardUpdatedClear = createAction('[DASHBOARD] Updated Clear');
export const DashboardCreatedClear = createAction('[DASHBOARD] Created Clear');
