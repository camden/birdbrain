import React from 'react';
import { GroveGameState } from '@server/store/games/grovetenders/types';
import GroveGameBar from './GameBar';
import styles from './Main.module.css';
import { useCurrentPlayer } from 'utils/grovetenders-utils';
import GroveMap from './Map';
import GroveMainInput from './MainInput';

export interface MainProps {
  game: GroveGameState;
}

const GroveMain: React.FC<MainProps> = ({ game }) => {
  const currentPlayer = useCurrentPlayer(game);

  return (
    <div className={styles.wrapper}>
      <GroveGameBar game={game} />
      <GroveMap game={game} />
      <GroveMainInput game={game} />
    </div>
  );
};

export default GroveMain;
