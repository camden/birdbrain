import React from 'react';
import { FishbowlGameState } from '@server/store/games/fishbowl/types';
import { Room } from '@server/store/general/types';
import styles from './Main.module.css';
import GameScreen from './GameScreen';

export interface FishbowlProps {
  game: FishbowlGameState;
  room: Room;
}

const FishbowlMain: React.FC<FishbowlProps> = ({ game, room }) => {
  return (
    <div className={styles.wrapper}>
      <GameScreen game={game} />
    </div>
  );
};

export default FishbowlMain;
