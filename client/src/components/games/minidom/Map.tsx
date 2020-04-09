import React from 'react';
import { MinidomGameState } from '@server/store/games/minidom/types';
import styles from './Map.module.css';
import cx from 'classnames';

export interface MinidomMapProps {
  game: MinidomGameState;
}

const MinidomMap: React.FC<MinidomMapProps> = ({ game }) => {
  // @TODO this is a dumb way of doing it
  const rows = [0, 1, 2];
  const cols = [0, 1, 2];

  const player1Location = game.players[0].location;

  return (
    <div className={styles.wrapper}>
      {rows.map((y) => (
        <div className={styles.row}>
          {cols.map((x) => (
            <Point
              occupied={player1Location.x === x && player1Location.y === y}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export interface PointProps {
  occupied?: boolean;
}

const Point: React.FC<PointProps> = (props) => {
  return (
    <div
      className={cx(styles.point, {
        [styles.occupied]: props.occupied,
      })}
    />
  );
};

export default MinidomMap;
