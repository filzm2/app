import { createAction, props } from '@ngrx/store';

import { ICommon } from '@models/common/common.model';

export const CommonUpdate = createAction(
  '[COMMON] Update -> Success',
  props<{ payload: ICommon }>(),
);



