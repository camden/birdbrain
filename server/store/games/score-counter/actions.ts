import { createAction } from 'typesafe-actions';

export const scoreCounterAddAction = createAction(
  'SC_ADD',
  (amount: number) => amount
)();

export const scoreCounterSetAction = createAction(
  'SC_SET',
  (amount: number) => amount
)();
