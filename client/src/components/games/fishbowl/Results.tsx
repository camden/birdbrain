import React, { useState, useCallback, useEffect } from 'react';
import {
  FishbowlGameState,
  FishbowlPlayer,
  FishbowlTeam,
} from '@server/store/games/fishbowl/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { fshAckResults } from '@server/store/games/fishbowl/actions';
import styles from './Results.module.css';
import {
  POINTS_FOR_SKIPPED,
  POINTS_FOR_GOT,
} from '@server/store/games/fishbowl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowRight, faCheck } from '@fortawesome/pro-solid-svg-icons';
import TeamScore from './TeamScore';
import WaitingMessage from '../the-resistance/WaitingMessage';
import { prop } from 'ramda';
import TeamBar from './TeamBar';
import { getCurrentUser } from 'store/selectors';
import useSelector from 'store/use-selector';
import TeamName from './TeamName';
import useSound from 'hooks/use-sound';
const RoundEndNoise = require('assets/sounds/round-end.wav');

export interface ResultsProps {
  game: FishbowlGameState;
}

const Results: React.FC<ResultsProps> = ({ game }) => {
  const currentUser = useSelector(getCurrentUser());
  const dispatch = useDispatch();
  const [acked, setAcked] = useState(false);

  const onContinueClick = useCallback(() => {
    dispatch(sendMessage(fshAckResults()));
    setAcked(true);
  }, [dispatch]);

  const playRoundEndSound = useSound(RoundEndNoise);

  useEffect(() => {
    const timer = setTimeout(() => {
      playRoundEndSound();
    }, 250);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const answersSkippedWithoutDupes = game.answersSkipped.filter(
    (item, index) => game.answersSkipped.indexOf(item) === index
  );

  const totalPointsScoredThisRound =
    POINTS_FOR_GOT * game.answersGot.length +
    POINTS_FOR_SKIPPED * answersSkippedWithoutDupes.length;

  const playersWhoHaveNotAcked: FishbowlPlayer[] = game.players.filter(
    player => !game.acknowledged.includes(player.userId)
  );

  const currentPlayer = game.players.find(p => p.userId === currentUser?.id);
  if (!currentPlayer) {
    return (
      <div>
        Something went wrong! Can't find player for current user. ERROR #2
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <TeamBar team={currentPlayer.team} playerName={currentPlayer.name} />
      <h1 className={styles.title}>Round Results</h1>
      <p>
        <TeamName team={game.activePlayer.team} /> was playing.
      </p>
      <p>
        <strong>{game.activePlayer.name}</strong> was the active player.
      </p>
      <p>
        Got {game.answersGot.length} phrases{' '}
        <FontAwesomeIcon icon={faLongArrowRight} /> +
        {POINTS_FOR_GOT * game.answersGot.length} points.
      </p>
      <section className={styles.answersList}>
        {game.answersGot.map(answer => (
          <div key={answer}>
            <FontAwesomeIcon icon={faCheck} /> {answer}
          </div>
        ))}
      </section>
      <p>
        Skipped {answersSkippedWithoutDupes.length} phrase
        {answersSkippedWithoutDupes.length !== 1 ? 's' : ''}{' '}
        <FontAwesomeIcon icon={faLongArrowRight} />{' '}
        {POINTS_FOR_SKIPPED * answersSkippedWithoutDupes.length} points.
      </p>
      <p>
        <TeamName team={game.activePlayer.team} /> scored{' '}
        {totalPointsScoredThisRound} points.
      </p>
      <section className={styles.scores}>
        <TeamScore team={FishbowlTeam.TEAM_A} score={game.score.TEAM_A} />
        <TeamScore team={FishbowlTeam.TEAM_B} score={game.score.TEAM_B} />
      </section>
      <section className={styles.continueArea}>
        {acked && (
          <WaitingMessage
            playersThatNeedToAct={playersWhoHaveNotAcked.map(prop('name'))}
            verb="continue"
          />
        )}
        {!acked && (
          <Button secondary onClick={onContinueClick} fullWidth>
            Continue
          </Button>
        )}
      </section>
    </div>
  );
};

export default Results;
