import React from 'react';
import styles from './TeamScore.module.css';

export interface TeamScoreProps {
  teamName: string;
  score: number;
}

const TeamScore: React.FC<TeamScoreProps> = ({ teamName, score }) => {
  return (
    <div className={styles.teamScoreWrapper}>
      <div>{teamName}</div>
      <div className={styles.teamPoints}>{score}</div>
      <div>points</div>
    </div>
  );
};

export default TeamScore;
