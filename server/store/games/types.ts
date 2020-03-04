export enum GameType {
  THE_RESISTANCE = 'THE_RESISTANCE',
  SKULL = 'SKULL'
}

export type GameID = string;

export interface Game {
  id: GameID;
  type: GameType;
}

export interface GameMetadata {
  title: string;
  description: string;
  playerCount: string;
  time: string;
}
