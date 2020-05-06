import { createAction } from 'typesafe-actions';

export const speedboatDummyAction = createAction(
  'SB_DUMMY',
  (name: string) => name
)();
