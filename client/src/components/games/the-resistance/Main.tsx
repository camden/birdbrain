import React, { useState } from 'react';
import { ResistanceGameState } from '@server/store/games/the-resistance/types';
import GameScreen from './GameScreen';
import GameToolbar from './GameToolbar';
import Role from './Role';
import styles from './Main.module.css';
import { Room } from '@server/store/general/types';
import cx from 'classnames';

export interface ResistanceProps {
  game: ResistanceGameState;
  room: Room;
}

const TheResistanceMain: React.FC<ResistanceProps> = ({ game, room }) => {
  const [showRole, setShowRole] = useState(false);

  return (
    <div className={styles.main}>
      <section className={styles.game_screen_section}>
        {showRole && (
          <div className={styles.role_screen}>
            <Role game={game} />
          </div>
        )}
        <div className={cx(styles.game_wrapper, { [styles.hidden]: showRole })}>
          <GameScreen game={game} />
        </div>
      </section>
      <section className={styles.game_toolbar_section}>
        <GameToolbar
          game={game}
          onViewRoleMouseDown={() => setShowRole(true)}
          onViewRoleMouseUp={() => setShowRole(false)}
        />
      </section>
    </div>
  );
};

export default TheResistanceMain;
