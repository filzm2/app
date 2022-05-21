import { createAction, props } from '@ngrx/store';

export const DashboardChartCommentsGet = createAction(
  '[DASHBOARD] Chart Comments Get',
  props<{ dashboardId: any; chartId: any; callback?: Function }>()
);
export const DashboardChartCommentsGetSuccess = createAction(
  '[DASHBOARD] Chart Comments Get -> Success',
  props<{ payload: any }>()
);
export const DashboardChartCommentsGetError = createAction(
  '[DASHBOARD] Chart Comments Get -> Error',
  props<{ payload: any }>()
);

export const DashboardChartCommentsPost = createAction(
  '[DASHBOARD] Chart Comments Post',
  props<{ dashboardId: any; chartId: any; payload: any }>()
);
export const DashboardChartCommentsPostSuccess = createAction(
  '[DASHBOARD] Chart Comments Post -> Success',
  props<{ payload: any }>()
);
export const DashboardChartCommentsPostError = createAction(
  '[DASHBOARD] Chart Comments Post -> Error',
  props<{ payload: any }>()
);

export const DashboardChartCommentsDelete = createAction(
  '[DASHBOARD] Chart Comments Delete',
  props<{ dashboardId: any; chartId: any; payload: any }>()
);
export const DashboardChartCommentsDeleteSuccess = createAction(
  '[DASHBOARD] Chart Comments Delete -> Success',
  props<{ payload: any }>()
);
export const DashboardChartCommentsDeleteError = createAction(
  '[DASHBOARD] Chart Comments Delete -> Error',
  props<{ payload: any }>()
);

export const DashboardChartCommentsPut = createAction(
  '[DASHBOARD] Chart Comments Put',
  props<{ dashboardId: any; chartId: any; payload: any }>()
);
export const DashboardChartCommentsPutSuccess = createAction(
  '[DASHBOARD] Chart Comments Put -> Success',
  props<{ payload: any }>()
);
export const DashboardChartCommentsPutError = createAction(
  '[DASHBOARD] Chart Comments Put -> Error',
  props<{ payload: any }>()
);

export const DashboardCommentsGet = createAction(
  '[DASHBOARD] Comments Get',
  props<{ dashboardId: any }>()
);
export const DashboardCommentsGetSuccess = createAction(
  '[DASHBOARD] Comments Get -> Success',
  props<{ payload: any }>()
);
export const DashboardCommentsGetError = createAction(
  '[DASHBOARD] Comments Get -> Error',
  props<{ payload: any }>()
);

export const DashboardCommentsClear = createAction('[DASHBOARD] Chart Comments Clear');
