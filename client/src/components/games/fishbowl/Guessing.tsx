import React, { useState } from 'react';
import { FishbowlGameState } from '@server/store/games/fishbowl/types';
import useInterval from 'use-interval';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import {
  fshReportEndOfRound,
  fshGotAnswer,
  fshSkipAnswer,
} from '@server/store/games/fishbowl/actions';
import Button from 'components/shared/button/Button';
import { getCurrentAnswer } from '@server/store/games/fishbowl/selectors';
import { getCurrentUser } from 'store/selectors';
import styles from './Guessing.module.css';
import { Textfit } from 'react-textfit';

export interface GuessingProps {
  game: FishbowlGameState;
}

const Guessing: React.FC<GuessingProps> = ({ game }) => {
  const currentUser = useSelector(getCurrentUser());
  const isActivePlayer = currentUser?.id === game.activePlayer.userId;

  const [timeLeft, setTimeLeft] = useState(30);
  const dispatch = useDispatch();
  const currentAnswer = getCurrentAnswer(game);

  useInterval(() => {
    if (!game.roundEndTime) {
      throw new Error('RoundEndTime should be set.');
    }

    const timeLeftMs = game.roundEndTime - Date.now();
    const timeLeftSeconds = Math.floor(timeLeftMs / 1000);

    setTimeLeft(timeLeftSeconds);

    if (timeLeftSeconds <= 0) {
      dispatch(sendMessage(fshReportEndOfRound()));
    }
  }, 1000);

  const currentPlayer = game.players.find(p => p.userId === currentUser?.id);
  if (!currentPlayer) {
    throw new Error('Could not find player.');
  }

  const isOnSameTeamAsActivePlayer =
    currentPlayer.team === game.activePlayer.team;

  return (
    <div className={styles.wrapper}>
      <h2>{game.activePlayer.name} is guessing!</h2>
      <div>The current game is {game.currentGameType}.</div>
      {isActivePlayer && (
        <>
          <div className={styles.answer}>
            <Textfit mode="single">{currentAnswer}</Textfit>
          </div>
          <section className={styles.buttons}>
            <Button
              className={styles.button}
              onClick={() => dispatch(sendMessage(fshGotAnswer()))}
            >
              Got it!
            </Button>
            <Button
              className={styles.button}
              secondary
              onClick={() => dispatch(sendMessage(fshSkipAnswer()))}
            >
              Skip it!
            </Button>
          </section>
        </>
      )}
      {!isActivePlayer && isOnSameTeamAsActivePlayer && (
        <div className={styles.info}>
          <div className={styles.team_info}>
            <strong>{game.activePlayer.name}</strong> is on your team.
          </div>
          <div>Start guessing!</div>
        </div>
      )}
      {!isActivePlayer && !isOnSameTeamAsActivePlayer && (
        <div className={styles.info}>
          <div className={styles.teamInfo}>
            <strong>{game.activePlayer.name}</strong> is not on your team.
          </div>
          <div>Hang tight, it'll be your team's turn soon!</div>
        </div>
      )}
      <div className={styles.timeDisplay}>
        <div className={styles.time}>{timeLeft}</div>
        <div>seconds left</div>
      </div>
    </div>
  );
};

export default Guessing;