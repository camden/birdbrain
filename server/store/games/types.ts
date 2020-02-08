export enum GameID {
  THE_RESISTANCE = 'THE_RESISTANCE',
}

export interface GameState {
  type: GameID; // e.g. The Resistance, fishbowl, etc
}

// ACTIONS

export const SET_CURRENT_GAME = 'SET_CURRENT_GAME';

export interface SetCurrentGameAction {
  type: typeof SET_CURRENT_GAME;
  payload: {
    game: string;
  };
}

export type GameActionTypes = SetCurrentGameAction;
