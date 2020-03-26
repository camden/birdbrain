import React, { useState, useCallback } from 'react';
import { FishbowlGameState } from '@server/store/games/fishbowl/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { fshAckResults } from '@server/store/games/fishbowl/actions';
import styles from './Results.module.css';
import {
  TEAM_A_DISPLAY_NAME,
  TEAM_B_DISPLAY_NAME,
  POINTS_FOR_SKIPPED,
  POINTS_FOR_GOT,
} from '@server/store/games/fishbowl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowRight, faCheck } from '@fortawesome/pro-solid-svg-icons';

export interface ResultsProps {
  game: FishbowlGameState;
}

const Results: React.FC<ResultsProps> = ({ game }) => {
  const dispatch = useDispatch();
  const [acked, setAcked] = useState(false);

  const onContinueClick = useCallback(() => {
    dispatch(sendMessage(fshAckResults()));
    setAcked(true);
  }, [dispatch]);

  const totalPointsScoredThisRound =
    POINTS_FOR_GOT * game.answersGot.length +
    POINTS_FOR_SKIPPED * game.answersSkipped.length;

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Round Results</h1>
      <p>
        <strong>{game.activePlayer.teamDisplayName}</strong> was playing.
      </p>
      <p>
        <strong>{game.activePlayer.name}</strong> was the active player.
      </p>
      <p>
        Got {game.answersGot.length} phrases{' '}
        <FontAwesomeIcon icon={faLongArrowRight} /> +
        {POINTS_FOR_GOT * game.answersGot.length} points.
      </p>
      {game.answersGot.map(answer => (
        <div key={answer}>
          <FontAwesomeIcon icon={faCheck} /> {answer}
        </div>
      ))}
      <p>
        Skipped {game.answersSkipped.length} phrases{' '}
        <FontAwesomeIcon icon={faLongArrowRight} />{' '}
        {POINTS_FOR_SKIPPED * game.answersSkipped.length} points.
      </p>
      <p>
        This round, <strong>{game.activePlayer.teamDisplayName}</strong> scored{' '}
        {totalPointsScoredThisRound} points.
      </p>
      <section className={styles.scores}>
        <TeamScore teamName={TEAM_A_DISPLAY_NAME} score={game.score.TEAM_A} />
        <TeamScore teamName={TEAM_B_DISPLAY_NAME} score={game.score.TEAM_B} />
      </section>
      {!acked && (
        <Button secondary onClick={onContinueClick} fullWidth>
          Continue
        </Button>
      )}
    </div>
  );
};

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

export default Results;
