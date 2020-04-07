import React from 'react';
import { MinidomGameState } from '@server/store/games/minidom/types';
import styles from './GameBar.module.css';
import { useCurrentPlayer } from 'utils/minidom-utils';
import LabelWithIcon from './LabelWithIcon';
import { faUser, faHeart, faStar } from '@fortawesome/pro-solid-svg-icons';

export interface GameBarProps {
  game: MinidomGameState;
}

const MinidomGameBar: React.FC<GameBarProps> = ({ game }) => {
  const currentPlayer = useCurrentPlayer(game);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <section>
            <LabelWithIcon icon={faUser} label={currentPlayer.name} />
          </section>
          <section>
            <LabelWithIcon icon={faHeart} label={currentPlayer.health} />
          </section>
          <section>
            <LabelWithIcon icon={faStar} label={currentPlayer.score} />
          </section>
        </div>
      </div>
      <div className={styles.spacing}></div>
    </>
  );
};

export default MinidomGameBar;
