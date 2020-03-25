import React from 'react';
import { FishbowlGameState } from '@server/store/games/fishbowl/types';

export interface GuessingProps {
  game: FishbowlGameState;
}

const Guessing: React.FC<GuessingProps> = ({ game }) => {
  return (
    <div>
      <h2>{game.activePlayer.name} is guessing!</h2>
    </div>
  );
};

export default Guessing;
