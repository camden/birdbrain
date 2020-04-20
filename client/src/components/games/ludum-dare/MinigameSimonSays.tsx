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
import CircleShape from 'assets/images/ludum-dare/gui/shapes/circlePat1.png';
import TriangleShape from 'assets/images/ludum-dare/gui/shapes/triPat2.png';
import StarShape from 'assets/images/ludum-dare/gui/shapes/starPat3.png';
import DiamondShape from 'assets/images/ludum-dare/gui/shapes/simpleDmnd.png';
import SquareShape from 'assets/images/ludum-dare/gui/shapes/sqrPat4.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace } from '@fortawesome/pro-solid-svg-icons';

export interface LudumMinigameSimonSaysProps {
  game: LudumGameState;
  minigame: LudumMinigameSimonSaysState;
}

const getImageForShape = (
  shape: LudumShape,
  noClassName?: boolean
): ReactNode => {
  let imgUrl;
  switch (shape) {
    case LudumShape.CIRCLE:
      imgUrl = CircleShape;
      break;
    case LudumShape.DIAMOND:
      imgUrl = DiamondShape;
      break;
    case LudumShape.SQUARE:
      imgUrl = SquareShape;
      break;
    case LudumShape.STAR:
      imgUrl = StarShape;
      break;
    case LudumShape.TRIANGLE:
      imgUrl = TriangleShape;
      break;
  }

  const className = noClassName ? undefined : styles.shapeImg;
  return <img src={imgUrl} className={className} />;
};

const NUM_TICKS_WITH_NO_SHAPE = 3;
const TIME_BETWEEN_SHAPES_MS = 500;

const buttonForShape = (
  shape: LudumShape,
  onPress: (shape: LudumShape) => void
): ReactNode => {
  return (
    <Button secondary onClick={() => onPress(shape)}>
      {getImageForShape(shape)}
    </Button>
  );
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
      : getImageForShape(minigame.phrase[indexOfCurrentLetter], true);

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
            {currentGuess[idx] && getImageForShape(currentGuess[idx])}
          </div>
        ))}
      </div>
      <div className={styles.buttons}>
        {buttonForShape(LudumShape.CIRCLE, onPressGuessButton)}
        {buttonForShape(LudumShape.STAR, onPressGuessButton)}
        {buttonForShape(LudumShape.DIAMOND, onPressGuessButton)}
        {buttonForShape(LudumShape.SQUARE, onPressGuessButton)}
        {buttonForShape(LudumShape.TRIANGLE, onPressGuessButton)}
        <Button
          secondary={currentGuess.length < minigame.phrase.length}
          onClick={() => onBackspace()}
        >
          <FontAwesomeIcon icon={faBackspace} />
        </Button>
      </div>
    </div>
  );
};

export default LudumMinigameSimonSays;
