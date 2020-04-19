import React, { useState, useCallback, ReactNode } from 'react';
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
import { equals } from 'ramda';

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

const LudumMinigameSimonSays: React.FC<LudumMinigameSimonSaysProps> = ({
  game,
  minigame,
}) => {
  const dispatch = useDispatch();
  const [currentGuess, setCurrentGuess] = useState<LudumShape[]>([]);
  const currentPlayer = useCurrentPlayer(game);

  const onPressGuessButton = (guess: LudumShape) => {
    const nextGuess = currentGuess.concat([guess]);
    setCurrentGuess(nextGuess);
    dispatch(sendMessage(ludumCheckMinigameAnswer(nextGuess)));
  };

  const onBackspace = () =>
    setCurrentGuess(currentGuess.splice(0, currentGuess.length - 1));

  const [indexOfCurrentLetter, setIndexOfCurrentLetter] = useState(0);

  useInterval(() => {
    const nextIdx = (indexOfCurrentLetter + 1) % (minigame.phrase.length + 1);
    setIndexOfCurrentLetter(nextIdx);
  }, 250);

  const curShape: ReactNode =
    indexOfCurrentLetter === minigame.phrase.length
      ? ' '
      : getImageForShape(minigame.phrase[indexOfCurrentLetter]);

  const passedMinigame = game.playersWhoPassedCurrentMinigame.includes(
    currentPlayer.userId
  );

  return (
    <div>
      {passedMinigame && <strong>Congrats! You got the right answer</strong>}
      {currentGuess.length >= minigame.phrase.length &&
        !equals(currentGuess, minigame.phrase) && (
          <strong>Nope, try again</strong>
        )}
      <div>simon says! {curShape}</div>
      <div>
        the answer has <strong>{minigame.phrase.length} shapes</strong>
      </div>
      <div>your guess: {currentGuess.map(getImageForShape)}</div>
      <Button onClick={() => onPressGuessButton(LudumShape.HEART)}>💙</Button>
      <Button onClick={() => onPressGuessButton(LudumShape.TRIANGLE)}>
        🔺️
      </Button>
      <Button onClick={() => onPressGuessButton(LudumShape.CIRCLE)}>🟠</Button>
      <Button onClick={() => onBackspace()}>Backspace</Button>
    </div>
  );
};

export default LudumMinigameSimonSays;
