import React from 'react';

import { GameType, GameMetadata } from '@server/store/games/types';
import CustomGameCard from './CustomGameCard';

export interface GameCardProps {
  gameType: GameType;
  onClick?: () => void;
  className?: string;
}

const getGameMetadata = (gameType: GameType): GameMetadata => {
  switch (gameType) {
    case GameType.THE_RESISTANCE:
      return {
        title: 'The Resistance',
        playerCount: '5-10',
        time: '30 min',
        description: 'A classic party game of social deduction.',
      };
    case GameType.SKULL:
      return {
        // TODO change title
        title: 'Skull & Roses',
        playerCount: '3-6',
        time: '15-45 min',
        description: 'A tense bluffing game with no luck involved.',
      };
    case GameType.CHAT:
      return {
        title: 'Chat',
        playerCount: '1-100',
        time: '-',
        description: 'A simple chat room.',
      };
  }
};

const GameCard: React.FC<GameCardProps> = props => {
  const metadata = getGameMetadata(props.gameType);

  return (
    <CustomGameCard
      className={props.className}
      title={metadata.title}
      playerCount={metadata.playerCount}
      time={metadata.time}
      description={metadata.description}
      onClick={props.onClick}
    />
  );
};

export default GameCard;
