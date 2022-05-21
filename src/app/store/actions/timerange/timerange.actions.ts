import { createAction, props } from '@ngrx/store';

export const TimeRangeGet = createAction('[TIME_RANGE] Get', props<{ payload: any}>());
export const TimeRangeGetSuccess = createAction('[TIME_RANGE] Get -> Success', props<{payload: any}>());
export const TimeRangeGetError = createAction('[TIME_RANGE] Get -> Error', props<{payload: any}>());