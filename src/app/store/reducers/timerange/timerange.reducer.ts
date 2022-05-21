import { createReducer, on, Action } from '@ngrx/store';

import * as TimeRangeActions from '@store/actions/timerange/timerange.actions';

export interface State {
    data: any;
    loading: boolean;
    error: any;
  }
  
  export const initState = {
    data: null as any,
    loading: true,
    error: null as any,
  };
  

const timerangeReducer = createReducer(
  initState,
  on(TimeRangeActions.TimeRangeGetSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload,
    error: null,
  })),
  on(TimeRangeActions.TimeRangeGetError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    needUpdate: false,
  })),
);

export function reducer(state: State | undefined, action: Action) {
  return timerangeReducer(state, action);
}