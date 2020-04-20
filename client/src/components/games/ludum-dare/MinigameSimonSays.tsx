import React, { useState, ReactNode } from 'react';
import {
  LudumGameState,
  LudumMinigameSimonSaysState,
  LudumShape,
} from '@server/store/games/ludum-dare/types';
import useInterval from 'use-interval';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { ludumCheckMinigameAnswer } from '@server/store/games/ludum-dare/actions';
import { useCurrentPlayer } from 'utils/ludum-dare-utils';
import { equals, times, identity } from 'ramda';
import styles from './MinigameSimonSays.module.css';

export interface LudumMinigameSimonSaysProps {
  game: LudumGameState;
  minigame: LudumMinigameSimonSaysState;
}

const getImageForShape = (shape: LudumShape): ReactNode => {
  switch (shape) {
    case LudumShape.CIRCLE:
      return '🟠';
    case LudumShape.HEART:
      return '💙';
    case LudumShape.TRIANGLE:
      return '🔺️';
  }
};

const NUM_TICKS_WITH_NO_SHAPE = 4;
const TIME_BETWEEN_SHAPES_MS = 500;

const LudumMinigameSimonSays: React.FC<LudumMinigameSimonSaysProps> = ({
  game,
  minigame,
}) => {
  const dispatch = useDispatch();
  const [currentGuess, setCurrentGuess] = useState<LudumShape[]>([]);
  const currentPlayer = useCurrentPlayer(game);

  const onPressGuessButton = (guess: LudumShape) => {
    const nextGuess = currentGuess.concat([guess]);
    if (nextGuess.length > minigame.phrase.length) {
      return;
    }

    setCurrentGuess(nextGuess);
    dispatch(sendMessage(ludumCheckMinigameAnswer(nextGuess)));
  };

  const onBackspace = () =>
    setCurrentGuess(currentGuess.splice(0, currentGuess.length - 1));

  const [indexOfCurrentLetter, setIndexOfCurrentLetter] = useState(0);

  useInterval(() => {
    const nextIdx =
      (indexOfCurrentLetter + 1) %
      (minigame.phrase.length + NUM_TICKS_WITH_NO_SHAPE);
    setIndexOfCurrentLetter(nextIdx);
  }, TIME_BETWEEN_SHAPES_MS);

  const curShape: ReactNode =
    indexOfCurrentLetter >= minigame.phrase.length
      ? '⠀'
      : getImageForShape(minigame.phrase[indexOfCurrentLetter]);

  const passedMinigame = game.playersWhoPassedCurrentMinigame.includes(
    currentPlayer.userId
  );

  return (
    <div className={styles.wrapper}>
      {passedMinigame && <strong>Congrats! You got the right answer</strong>}
      {currentGuess.length >= minigame.phrase.length &&
        !equals(currentGuess, minigame.phrase) && (
          <strong>Nope, try again</strong>
        )}
      <div className={styles.bubble}>
        <div className={styles.currentShape}>{curShape}</div>
      </div>
      <div
        className={styles.guessWrapper}
        style={{
          gridTemplateColumns: `repeat(${minigame.phrase.length}, 1fr)`,
        }}
      >
        {times(identity, minigame.phrase.length).map((idx) => (
          <div key={idx} className={styles.emptyGuessSpace}>
            {getImageForShape(currentGuess[idx])}
          </div>
        ))}
      </div>
      <Button secondary onClick={() => onPressGuessButton(LudumShape.HEART)}>
        💙
      </Button>
      <Button secondary onClick={() => onPressGuessButton(LudumShape.TRIANGLE)}>
        🔺️
      </Button>
      <Button secondary onClick={() => onPressGuessButton(LudumShape.CIRCLE)}>
        🟠
      </Button>
      <Button
        secondary={currentGuess.length < minigame.phrase.length}
        onClick={() => onBackspace()}
      >
        Backspace
      </Button>
    </div>
  );
};

export default LudumMinigameSimonSays;
