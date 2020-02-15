import React, { useState } from 'react';
import { ResistanceGameState } from '@server/store/games/the-resistance/types';
import GameScreen from './GameScreen';
import GameToolbar from './GameToolbar';
import Role from './Role';
import styles from './Main.module.css';

export interface ResistanceProps {
  game: ResistanceGameState;
}

const TheResistanceMain: React.FC<ResistanceProps> = ({ game }) => {
  const [showRole, setShowRole] = useState(false);

  console.log('all missions', game.allMissions);

  return (
    <div className={styles.main}>
      <section className={styles.game_screen_section}>
        {showRole ? <Role game={game} /> : <GameScreen game={game} />}
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
