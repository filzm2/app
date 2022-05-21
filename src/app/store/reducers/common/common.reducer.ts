import { createReducer, on, Action } from '@ngrx/store';

import { ICommon } from '@models/common/common.model';
import * as CommonActions from '@store/actions/common/common.actions';

export interface State {
  data: ICommon;
}

export const initState: {
  data: {
    isHeaderMobileMenuShowed?: boolean,
  }
} = {
  data: {
    isHeaderMobileMenuShowed: false,
  },
};

const commonReducer = createReducer(
  initState,
  on(CommonActions.CommonUpdate, (state, { payload }) => ({
    data: {
      ...state.data,
      ...payload,
    },
  })),
);

export function reducer(state: State | undefined, action: Action) {
  return commonReducer(state, action);
}
