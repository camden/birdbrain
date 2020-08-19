import { createAction } from 'typesafe-actions';

export const scoreCounterDummyAction = createAction(
  'SB_DUMMY',
  (name: string) => name
)();
