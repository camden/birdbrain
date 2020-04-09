import React from 'react';
import {
  MinidomGameState,
  MinidomPlayer,
} from '@server/store/games/minidom/types';
import styles from './Map.module.css';
import cx from 'classnames';

export interface MinidomMapProps {
  game: MinidomGameState;
}

const MinidomMap: React.FC<MinidomMapProps> = ({ game }) => {
  // @TODO this is a dumb way of doing it
  const rows = [0, 1, 2];
  const cols = [0, 1, 2];

  const mapLocations = game.players.map((x, index) => ({
    ...x.location,
    color: index === 0 ? 'hotpink' : 'teal',
  }));

  return (
    <div className={styles.wrapper}>
      {rows.map((y) => (
        <div className={styles.row}>
          {cols.map((x) => (
            <Point
              occupied={!!mapLocations.find((l) => l.x === x && l.y === y)}
              color={mapLocations.find((l) => l.x === x && l.y === y)?.color}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export interface PointProps {
  occupied?: boolean;
  color?: string;
}

const OccupiedPoint = (player: MinidomPlayer) => {
  return <Point occupied />;
};

const Point: React.FC<PointProps> = (props) => {
  return (
    <div
      style={{
        backgroundColor: props.color,
      }}
      className={cx(styles.point, {
        [styles.occupied]: props.occupied,
      })}
    />
  );
};

export default MinidomMap;
