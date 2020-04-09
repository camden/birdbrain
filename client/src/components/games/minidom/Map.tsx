import React from 'react';
import {
  MinidomGameState,
  MinidomPlayer,
} from '@server/store/games/minidom/types';
import styles from './Map.module.css';
import cx from 'classnames';
import { useCurrentPlayer } from 'utils/minidom-utils';

export interface MinidomMapProps {
  game: MinidomGameState;
}

const MinidomMap: React.FC<MinidomMapProps> = ({ game }) => {
  const currentPlayer = useCurrentPlayer(game);

  // @TODO this is a dumb way of doing it
  const rows = [0, 1, 2];
  const cols = [0, 1, 2];
  const numRows = 3;
  const numCols = 3;

  const locations: {
    [x: number]: {
      [y: number]: any[];
    };
  } = {};

  for (let x = 0; x < numCols; x++) {
    locations[x] = [];
    for (let y = 0; y < numRows; y++) {
      locations[x][y] = [];
    }
  }

  for (let i = 0; i < game.players.length; i++) {
    const player = game.players[i];
    const { x, y } = player.location;
    if (player.userId === currentPlayer.userId) {
      locations[x][y].push(player);
    }
  }

  return (
    <div className={styles.wrapper}>
      {rows.map((y) => (
        <div className={styles.row}>
          {cols.map((x) => (
            <Point occupants={locations[x][y]} />
          ))}
        </div>
      ))}
    </div>
  );
};

export interface PointProps {
  occupants: MinidomPlayer[];
}

const Point: React.FC<PointProps> = ({ occupants }) => {
  return (
    <div className={styles.point}>
      <div className={styles.inner}>
        {occupants.map((player) => (
          <div
            style={{ backgroundColor: player.color }}
            className={styles.player}
          />
        ))}
      </div>
    </div>
  );
};

export default MinidomMap;
