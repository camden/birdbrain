import React from 'react';

import { GameType, GameMetadata } from '@server/store/games/types';
import CustomGameCard from './CustomGameCard';
import useSound from 'hooks/use-sound';
const ButtonClickSound = require('assets/sounds/card-click.wav');

export interface GameCardProps {
  gameType: GameType;
  onClick?: () => void;
  className?: string;
  playSound?: boolean;
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
    case GameType.FISHBOWL:
      return {
        title: 'Fishbowl',
        playerCount: '3+',
        time: '20 min',
        description:
          'A fun party game that combines Password, Taboo, and Charades.',
      };
  }
};

const GameCard: React.FC<GameCardProps> = props => {
  const playSoundFn = useSound(ButtonClickSound);
  const metadata = getGameMetadata(props.gameType);

  return (
    <CustomGameCard
      className={props.className}
      title={metadata.title}
      playerCount={metadata.playerCount}
      time={metadata.time}
      description={metadata.description}
      onClick={(...args) => {
        if (props.playSound) {
          playSoundFn();
        }

        props.onClick && props.onClick(...args);
      }}
    />
  );
};

export default GameCard;
