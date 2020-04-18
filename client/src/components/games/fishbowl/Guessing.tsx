import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import TextFit from 'react-textfit';
import TeamBar from './TeamBar';
import TeamName from './TeamName';
import useSound from 'hooks/use-sound';
import { motion, AnimatePresence } from 'framer-motion';

const GotAnswerNoise = require('assets/sounds/got-answer.wav');
const SkippedAnswerNoise = require('assets/sounds/skipped-answer.wav');

export interface GuessingProps {
  game: FishbowlGameState;
}

const BUTTON_DISABLED_TIMEOUT = 500;

const Guessing: React.FC<GuessingProps> = ({ game }) => {
  const playGotAnswerSound = useSound(GotAnswerNoise);
  const playSkippedAnswerSound = useSound(SkippedAnswerNoise);
  const currentUser = useSelector(getCurrentUser());
  const isActivePlayer = currentUser?.id === game.activePlayer.userId;

  const [skippedLastAnswer, setSkippedLastAnswer] = useState(false);

  const [areButtonsDisabled, setAreButtonsDisabled] = useState(false);

  const startingTimeSeconds = Math.floor(game.nextRoundDuration / 1000);
  const [timeLeft, setTimeLeft] = useState(startingTimeSeconds);
  const dispatch = useDispatch();
  const currentAnswer = getCurrentAnswer(game);

  useInterval(() => {
    if (!game.roundEndTime) {
      throw new Error('RoundEndTime should be set.');
    }

    const timeLeftMs = game.roundEndTime - Date.now();
    const timeLeftSeconds = Math.floor(timeLeftMs / 1000);

    setTimeLeft(timeLeftSeconds);

    if (timeLeftMs <= 0) {
      dispatch(sendMessage(fshReportEndOfRound()));
    }
  }, 1000);

  const timer = useRef<NodeJS.Timeout | null>(null);

  const onButtonClick = useCallback(() => {
    setAreButtonsDisabled(true);
    timer.current = setTimeout(() => {
      setAreButtonsDisabled(false);
    }, BUTTON_DISABLED_TIMEOUT);
  }, []);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const onGotAnswer = useCallback(() => {
    dispatch(sendMessage(fshGotAnswer()));
    onButtonClick();

    setSkippedLastAnswer(false);
    playGotAnswerSound();
  }, [dispatch, onButtonClick, playGotAnswerSound]);

  const onSkippedAnswer = useCallback(() => {
    dispatch(sendMessage(fshSkipAnswer()));
    onButtonClick();

    setSkippedLastAnswer(true);
    playSkippedAnswerSound();
  }, [dispatch, onButtonClick, playSkippedAnswerSound]);

  const currentPlayer = game.players.find((p) => p.userId === currentUser?.id);
  if (!currentPlayer) {
    return (
      <div>
        Something went wrong! Can't find player for current user. ERROR #2
      </div>
    );
  }

  const isOnSameTeamAsActivePlayer =
    currentPlayer.team === game.activePlayer.team;

  const answerVariants = {
    initial: {
      y: -20,
      opacity: 0,
    },
    active: {
      y: 0,
      opacity: 1,
    },
    got: {
      x: 40,
      opacity: 0,
      color: 'green',
      transition: {
        duration: 0.2,
      },
    },
    skipped: {
      x: -40,
      opacity: 0,
      color: 'red',
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className={styles.wrapper}>
      <TeamBar team={currentPlayer.team} playerName={currentPlayer.name} />
      {isActivePlayer && (
        <>
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={currentAnswer}
              variants={answerVariants}
              initial="initial"
              animate="active"
              exit={skippedLastAnswer ? 'skipped' : 'got'}
              className={styles.answer}
            >
              <TextFit mode="single" className={styles.answerFit}>
                {currentAnswer}
              </TextFit>
            </motion.div>
          </AnimatePresence>
          <section className={styles.buttons}>
            <Button
              className={styles.button}
              onClick={onGotAnswer}
              disabled={areButtonsDisabled}
            >
              Got it!
            </Button>
            <Button
              className={styles.button}
              secondary
              onClick={onSkippedAnswer}
              disabled={areButtonsDisabled}
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
            <TeamName team={game.activePlayer.team} /> is playing now.
          </div>
          <div>
            Hang tight, it'll be <TeamName team={currentPlayer.team} />
            's turn soon!
          </div>
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
