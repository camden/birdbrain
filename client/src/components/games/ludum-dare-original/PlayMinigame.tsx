import React, { useState, ReactNode } from 'react';
import {
  LudumOriginalGameState,
  LudumOriginalMinigame,
  LudumOriginalMinigameSimonSaysState,
  LudumOriginalMinigameHydraulicsState,
  LudumOriginalMinigameReflexesState,
  LudumOriginalMinigamePizzaState,
} from '@server/store/games/ludum-dare-original/types';
import useInterval from 'use-interval';
import { MINIGAME_DURATION_MS } from '@server/store/games/ludum-dare-original';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { ludumOriginalReportEndMinigame } from '@server/store/games/ludum-dare-original/actions';
import LudumOriginalMinigameSimonSays from './MinigameSimonSays';
import LudumOriginalMinigameHydraulics from './MinigameHydraulics';
import LudumOriginalMinigameReflexes from './MinigameReflexes';
import styles from './PlayMinigame.module.css';
import LudumOriginalCharacter, {
  CharacterType,
  CharacterAnimation,
} from './Character';
import { useCurrentPlayer } from 'utils/ludum-dare-original-utils';
import { motion, AnimatePresence } from 'framer-motion';
import LudumOriginalMinigamePizza from './MinigamePizza';

export interface LudumOriginalPlayMinigameProps {
  game: LudumOriginalGameState;
}

const LudumOriginalPlayMinigame: React.FC<LudumOriginalPlayMinigameProps> = ({
  game,
}) => {
  const [timeLeft, setTimeLeft] = useState(
    Math.floor(MINIGAME_DURATION_MS / 1000)
  );
  const dispatch = useDispatch();
  const currentPlayer = useCurrentPlayer(game);

  useInterval(() => {
    if (!game.minigameEndTime) {
      throw new Error('RoundEndTime should be set.');
    }

    const timeLeftMs = game.minigameEndTime - Date.now();
    const timeLeftSeconds = Math.max(0, Math.floor(timeLeftMs / 1000));

    setTimeLeft(timeLeftSeconds);

    if (timeLeftMs <= 0) {
      dispatch(sendMessage(ludumOriginalReportEndMinigame()));
    }
  }, 1000);

  let minigame: ReactNode = null;
  switch (game.currentMinigame) {
    case LudumOriginalMinigame.SIMON_SAYS:
      minigame = (
        <LudumOriginalMinigameSimonSays
          game={game}
          minigame={
            game.currentMinigameState as LudumOriginalMinigameSimonSaysState
          }
        />
      );
      break;
    case LudumOriginalMinigame.HYDRAULICS:
      minigame = (
        <LudumOriginalMinigameHydraulics
          game={game}
          minigame={
            game.currentMinigameState as LudumOriginalMinigameHydraulicsState
          }
        />
      );
      break;
    case LudumOriginalMinigame.REFLEXES:
      minigame = (
        <LudumOriginalMinigameReflexes
          game={game}
          minigame={
            game.currentMinigameState as LudumOriginalMinigameReflexesState
          }
        />
      );
      break;
    case LudumOriginalMinigame.PIZZA:
      minigame = (
        <LudumOriginalMinigamePizza
          game={game}
          minigame={
            game.currentMinigameState as LudumOriginalMinigamePizzaState
          }
        />
      );
      break;
  }

  const sortaRunningOutOfTime = timeLeft <= 15;
  const notMuchTimeLeft = timeLeft <= 5;

  const currentPlayerPassed = game.playersWhoPassedCurrentMinigame.includes(
    currentPlayer.userId
  );

  let characterType = CharacterType.IDLE;
  let characterAnimation = CharacterAnimation.HOVER_SMALL;

  if (currentPlayerPassed) {
    characterType = CharacterType.WIN;
    characterAnimation = CharacterAnimation.SWAY;
  } else if (notMuchTimeLeft) {
    characterType = CharacterType.NERVOUS;
    characterAnimation = CharacterAnimation.SHAKE;
  } else if (sortaRunningOutOfTime) {
    characterType = CharacterType.PUZZLED;
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.topBar}>
        <div className={styles.characterWrapper}>
          <LudumOriginalCharacter
            id={currentPlayer.character.id}
            className={styles.character}
            type={characterType}
            animation={characterAnimation}
          />
        </div>
        <div className={styles.timeLeftWrapper}>
          <div className={styles.timeLeft}>{timeLeft}</div>
          <div className={styles.timeLeftLabel}>seconds left</div>
        </div>
      </section>
      <AnimatePresence exitBeforeEnter>
        {!currentPlayerPassed && (
          <motion.div
            className={styles.minigameWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ opacity: { duration: 1 } }}
            exit={{ opacity: 0 }}
          >
            {minigame}
          </motion.div>
        )}
        {currentPlayerPassed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ opacity: { duration: 1 } }}
          >
            <h1>You did it!</h1>
            <p>Hang tight while we wait for everyone else to finish.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LudumOriginalPlayMinigame;
