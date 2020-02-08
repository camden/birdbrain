export enum GameID {
  THE_RESISTANCE = 'THE_RESISTANCE',
}

export interface GameState {
  type: GameID; // e.g. The Resistance, fishbowl, etc
}
