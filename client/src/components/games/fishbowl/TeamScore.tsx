import React from 'react';
import styles from './TeamScore.module.css';
import TeamName from './TeamName';
import { FishbowlTeam } from '@server/store/games/fishbowl/types';

export interface TeamScoreProps {
  team: FishbowlTeam;
  score: number;
}

const TeamScore: React.FC<TeamScoreProps> = ({ team, score }) => {
  return (
    <div className={styles.teamScoreWrapper}>
      <div>
        <TeamName team={team} />
      </div>
      <div className={styles.teamPoints}>{score}</div>
      <div>points</div>
    </div>
  );
};

export default TeamScore;
