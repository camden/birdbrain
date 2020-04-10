import React from 'react';
import {
  MinidomGameState,
  MinidomPlayer,
} from '@server/store/games/minidom/types';
import styles from './Map.module.css';
import { useCurrentPlayer } from 'utils/minidom-utils';
import cx from 'classnames';

export interface MinidomMapProps {
  game: MinidomGameState;
}

export interface MapOccupant {
  player: MinidomPlayer;
  type: 'active' | 'hidden' | 'previous';
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
      [y: number]: MapOccupant[];
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
      locations[x][y].push({
        player,
        type: 'active',
      });
    } else {
      locations[x][y].push({
        player,
        type: 'hidden',
      });
    }

    if (player.previousLocation) {
      const { x: prevX, y: prevY } = player.previousLocation;
      locations[prevX][prevY].push({
        player,
        type: 'previous',
      });
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
  occupants: MapOccupant[];
}

const Point: React.FC<PointProps> = ({ occupants }) => {
  return (
    <div className={styles.point}>
      <div className={styles.inner}>
        {occupants
          .filter((o) => o.type !== 'hidden')
          .map((occupant) => (
            <div
              style={{
                color: occupant.player.color,
              }}
              className={cx(styles.player, {
                [styles.active]: occupant.type === 'active',
                [styles.previous]: occupant.type === 'previous',
              })}
            />
          ))}
      </div>
    </div>
  );
};

export default MinidomMap;
