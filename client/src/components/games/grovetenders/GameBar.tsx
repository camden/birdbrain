import React from 'react';
import { GroveGameState } from '@server/store/games/grovetenders/types';
import styles from './GameBar.module.css';
import { useCurrentPlayer } from 'utils/grovetenders-utils';
import LabelWithIcon from './LabelWithIcon';
import { faUser, faHeart, faStar } from '@fortawesome/pro-solid-svg-icons';

export interface GameBarProps {
  game: GroveGameState;
}

const GroveGameBar: React.FC<GameBarProps> = ({ game }) => {
  const currentPlayer = useCurrentPlayer(game);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <section>
            <LabelWithIcon icon={faUser} label={currentPlayer.name} />
          </section>
          <section>
            <LabelWithIcon icon={faHeart} label={10} />
          </section>
          <section>
            <LabelWithIcon icon={faStar} label={10} />
          </section>
        </div>
      </div>
      <div className={styles.spacing}></div>
    </>
  );
};

export default GroveGameBar;
