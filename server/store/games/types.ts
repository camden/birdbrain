export enum GameType {
  THE_RESISTANCE = 'THE_RESISTANCE',
}

export type GameID = string;

export interface Game {
  id: GameID;
  type: GameType;
}
