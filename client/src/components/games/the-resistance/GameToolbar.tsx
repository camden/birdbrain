import React from 'react';
import { ResistanceGameState } from '@server/store/games/the-resistance/types';
import styles from './GameToolbar.module.css';
import Button from 'components/shared/button/Button';
import MissionInfo from './MissionInfo';

export interface ResistanceToolbarProps {
  game: ResistanceGameState;
  onViewRoleMouseDown: () => any;
  onViewRoleMouseUp: () => any;
}

const TheResistanceGameToolbar: React.FC<ResistanceToolbarProps> = ({
  game,
  onViewRoleMouseDown,
  onViewRoleMouseUp,
}) => {
  const indexOfCurrentLeader = game.players
    .map(p => p.userId)
    .indexOf(game.missionLeader.userId);
  const indexOfNextLeader = (indexOfCurrentLeader + 1) % game.players.length;
  const nextLeader = game.players[indexOfNextLeader];

  return (
    <div className={styles.toolbar}>
      <section className={styles.mission_info}>
        <h3 className={styles.title}>Missions</h3>
        <div className={styles.missions}>
          {game.allMissions.map(mission => (
            <MissionInfo
              number={mission.number}
              requiredPlayers={mission.requiredPlayers}
              status={mission.status}
              isCurrentMission={mission.number === game.mission}
            />
          ))}
        </div>
        <div className={styles.next_leader}>Next Leader: {nextLeader.name}</div>
      </section>
      <section className={styles.role_button_wrapper}>
        <Button
          secondary
          onTouchStart={onViewRoleMouseDown}
          onTouchEnd={onViewRoleMouseUp}
          onMouseDown={onViewRoleMouseDown}
          onMouseUp={onViewRoleMouseUp}
          onMouseLeave={onViewRoleMouseUp}
        >
          Hold to View Role
        </Button>
      </section>
    </div>
  );
};

export default TheResistanceGameToolbar;
