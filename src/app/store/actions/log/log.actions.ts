import { createAction, props } from '@ngrx/store';

export const LogListGet = createAction('[LOG] List Get', props<{ payload: any }>());
export const LogListGetSuccess = createAction('[LOG] List Get -> Success', props<{ payload: any }>());
export const LogListGetError = createAction('[LOG] List Get -> Error', props<{ payload: any }>());

export const LogClear = createAction('[LOG] Clear');
