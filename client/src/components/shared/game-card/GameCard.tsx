import React from 'react';

import { GameType, GameMetadata } from '@server/store/games/types';
import CustomGameCard from './CustomGameCard';
import useSound from 'hooks/use-sound';
const ButtonClickSound = require('assets/sounds/card-click.wav');

export interface GameCardProps {
  gameType: GameType;
  onClick?: () => void;
  className?: string;
  disableSound?: boolean;
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
    case GameType.MINIDOM:
      return {
        title: 'Minidom',
        playerCount: '2-4',
        time: '10 min',
        description: 'A lightweight version of the deckbuilding game Dominion.',
      };
    case GameType.PONG:
      return {
        title: 'Pong',
        playerCount: '2',
        time: '10 min',
        description: 'The classic virtual tennis game.',
      };
    case GameType.LUDUM_ORIGINAL:
      return {
        title: `Win or Your Totobee WILL Die`,
        playerCount: '2-12',
        time: '10 min',
        description: 'Play games to keep your virtual pet alive!',
      };
    case GameType.LUDUM:
      return {
        title: `[NEW] Win or Your Totobee WILL Die`,
        playerCount: '2-12',
        time: '10 min',
        description: 'Play games to keep your virtual pet alive!',
      };
  }
};

const GameCard: React.FC<GameCardProps> = (props) => {
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
        if (!props.disableSound) {
          playSoundFn();
        }

        props.onClick && props.onClick(...args);
      }}
    />
  );
};

export default GameCard;
