export interface GameState {
  currentGameID: GameID | null;
}

export type GameID = string;

// ACTIONS

export const SET_CURRENT_GAME = 'SET_CURRENT_GAME';

export interface SetCurrentGameAction {
  type: typeof SET_CURRENT_GAME;
  payload: {
    game: GameID;
  };
}

export type GameActionTypes = SetCurrentGameAction;
