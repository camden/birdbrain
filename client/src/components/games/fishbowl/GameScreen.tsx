import React from 'react';
import {
  FishbowlGameState,
  FishbowlPhase,
} from '@server/store/games/fishbowl/types';
import Guessing from './Guessing';
import Results from './Results';
import PreRound from './PreRound';
import GameOver from './GameOver';

export interface GameScreenProps {
  game: FishbowlGameState;
}

const GameScreen: React.FC<GameScreenProps> = ({ game }) => {
  switch (game.phase) {
    case FishbowlPhase.PRE_ROUND:
      return <PreRound game={game} />;
    case FishbowlPhase.GUESSING:
      return <Guessing game={game} />;
    case FishbowlPhase.RESULTS:
      return <Results game={game} />;
    case FishbowlPhase.END_GAME_RESULTS:
      return <GameOver game={game} />;
  }
};

export default GameScreen;
