import React from 'react';

import { GameType } from '@server/store/games/types';
import CustomGameCard from './CustomGameCard';

export interface GameCardProps {
  gameType: GameType;
  onClick?: () => void;
}

const GameCard: React.FC<GameCardProps> = props => {
  return (
    <CustomGameCard
      title="The Resistance"
      playerCount="5-10"
      time="30 min"
      description={'A classic party game of social deduction.'}
      onClick={props.onClick}
    />
  );
};

export default GameCard;
