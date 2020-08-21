export enum GameType {
  THE_RESISTANCE = 'THE_RESISTANCE',
  FISHBOWL = 'FISHBOWL',
  SKULL = 'SKULL',
  CHAT = 'CHAT',
  MINIDOM = 'MINIDOM',
  PONG = 'PONG',
  LUDUM = 'LUDUM',
  LUDUM_ORIGINAL = 'LUDUM_ORIGINAL',
  SPEEDBOAT = 'SPEEDBOAT',
  SCORE_COUNTER = 'SCORE_COUNTER',
  GROVETENDERS = 'GROVETENDERS',
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
