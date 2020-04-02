import React, { ReactNode } from 'react';
import {
  FishbowlGameState,
  FishbowlTeam,
} from '@server/store/games/fishbowl/types';
import styles from './GameOver.module.css';
import {
  TEAM_A_DISPLAY_NAME,
  TEAM_B_DISPLAY_NAME,
} from '@server/store/games/fishbowl';
import TeamScore from './TeamScore';

export interface GameOverProps {
  game: FishbowlGameState;
}

const GameOver: React.FC<GameOverProps> = ({ game }) => {
  let resultMessage: ReactNode = '';

  const isTie = game.score.TEAM_A === game.score.TEAM_B;
  const winningTeam: FishbowlTeam =
    game.score.TEAM_A > game.score.TEAM_B
      ? FishbowlTeam.TEAM_A
      : FishbowlTeam.TEAM_B;

  if (isTie) {
    resultMessage = "The teams have tied! You're all winners!";
  } else if (winningTeam === FishbowlTeam.TEAM_A) {
    resultMessage = (
      <>
        <strong>{TEAM_A_DISPLAY_NAME}</strong> has won!
      </>
    );
  } else if (winningTeam === FishbowlTeam.TEAM_B) {
    resultMessage = (
      <>
        <strong>{TEAM_B_DISPLAY_NAME}</strong> has won!
      </>
    );
  }

  return (
    <div>
      <h1>Game over!</h1>
      <p>{resultMessage}</p>
      <section className={styles.scores}>
        <TeamScore team={FishbowlTeam.TEAM_A} score={game.score.TEAM_A} />
        <TeamScore team={FishbowlTeam.TEAM_B} score={game.score.TEAM_B} />
      </section>
    </div>
  );
};

export default GameOver;
