import React, { useState, ReactNode } from 'react';
import {
  LudumOriginalGameState,
  LudumOriginalMinigameSimonSaysState,
  LudumOriginalShape,
  LudumOriginalMinigame,
} from '@server/store/games/ludum-dare-original/types';
import useInterval from 'use-interval';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { ludumOriginalCheckMinigameAnswer } from '@server/store/games/ludum-dare-original/actions';
import { useCurrentPlayer } from 'utils/ludum-dare-original-utils';
import { times, identity } from 'ramda';
import styles from './MinigameSimonSays.module.css';
import CircleShape from 'assets/images/ludum-dare-original/gui/shapes/circlePat1.png';
import TriangleShape from 'assets/images/ludum-dare-original/gui/shapes/triPat2.png';
import StarShape from 'assets/images/ludum-dare-original/gui/shapes/starPat3.png';
import DiamondShape from 'assets/images/ludum-dare-original/gui/shapes/simpleDmnd.png';
import SquareShape from 'assets/images/ludum-dare-original/gui/shapes/sqrPat4.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBackspace,
  faCheck,
  faTimes,
} from '@fortawesome/pro-solid-svg-icons';

export interface LudumOriginalMinigameSimonSaysProps {
  game: LudumOriginalGameState;
  minigame: LudumOriginalMinigameSimonSaysState;
}

const getImageForShape = (
  shape: LudumOriginalShape,
  noClassName?: boolean
): ReactNode => {
  let imgUrl;
  switch (shape) {
    case LudumOriginalShape.CIRCLE:
      imgUrl = CircleShape;
      break;
    case LudumOriginalShape.DIAMOND:
      imgUrl = DiamondShape;
      break;
    case LudumOriginalShape.SQUARE:
      imgUrl = SquareShape;
      break;
    case LudumOriginalShape.STAR:
      imgUrl = StarShape;
      break;
    case LudumOriginalShape.TRIANGLE:
      imgUrl = TriangleShape;
      break;
  }

  const className = noClassName ? undefined : styles.shapeImg;
  return <img src={imgUrl} className={className} draggable={false} />;
};

const NUM_TICKS_WITH_NO_SHAPE = 3;

const buttonForShape = (
  shape: LudumOriginalShape,
  onPress: (shape: LudumOriginalShape) => void
): ReactNode => {
  return (
    <Button
      secondary
      onClick={() => onPress(shape)}
      className={styles.inputButton}
    >
      {getImageForShape(shape, true)}
    </Button>
  );
};

const LudumOriginalMinigameSimonSays: React.FC<LudumOriginalMinigameSimonSaysProps> = ({
  game,
  minigame,
}) => {
  const dispatch = useDispatch();
  const [currentGuess, setCurrentGuess] = useState<LudumOriginalShape[]>([]);
  const currentPlayer = useCurrentPlayer(game);

  const onPressGuessButton = (guess: LudumOriginalShape) => {
    const nextGuess = currentGuess.concat([guess]);
    if (nextGuess.length > minigame.phrase.length) {
      return;
    }

    setCurrentGuess(nextGuess);
    dispatch(sendMessage(ludumOriginalCheckMinigameAnswer(nextGuess)));
  };

  const onBackspace = () =>
    setCurrentGuess(currentGuess.splice(0, currentGuess.length - 1));

  const [indexOfCurrentLetter, setIndexOfCurrentLetter] = useState(
    minigame.phrase.length + NUM_TICKS_WITH_NO_SHAPE - 1
  );

  useInterval(() => {
    const nextIdx =
      (indexOfCurrentLetter + 1) %
      (minigame.phrase.length + NUM_TICKS_WITH_NO_SHAPE);
    setIndexOfCurrentLetter(nextIdx);
  }, minigame.timeBetweenShapes);

  const curShape: ReactNode =
    indexOfCurrentLetter >= minigame.phrase.length
      ? '⠀'
      : getImageForShape(minigame.phrase[indexOfCurrentLetter], true);

  const passedMinigame = game.playersWhoPassedCurrentMinigame.includes(
    currentPlayer.userId
  );

  const isFirstTimePlaying = !game.minigamesPlayedSoFar.includes(
    LudumOriginalMinigame.SIMON_SAYS
  );

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.instructions}>Transcribe!</h1>
      {isFirstTimePlaying && (
        <small className={styles.firstTimeInstructions}>
          Copy the phrase using the buttons below. Hit{' '}
          <strong>Backspace</strong>{' '}
          <FontAwesomeIcon icon={faBackspace} style={{ marginRight: 4 }} /> if
          you make a mistake.
        </small>
      )}
      <div className={styles.bubble}>
        <div className={styles.currentShape}>{curShape}</div>
      </div>
      <div
        className={styles.guessWrapper}
        style={{
          gridTemplateColumns: `repeat(${minigame.phrase.length}, minmax(0, 1fr))`,
        }}
      >
        {times(identity, minigame.phrase.length).map((idx) => (
          <div className={styles.guessSpaceWrapper} key={idx}>
            <div key={idx} className={styles.emptyGuessSpace}>
              {currentGuess[idx] && getImageForShape(currentGuess[idx])}
            </div>
            <div className={styles.hintIcon}>
              {minigame.phrase[idx] === currentGuess[idx] ? (
                <FontAwesomeIcon icon={faCheck} color="limegreen" />
              ) : (
                <FontAwesomeIcon icon={faTimes} color="red" />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.buttons}>
        {buttonForShape(LudumOriginalShape.CIRCLE, onPressGuessButton)}
        {buttonForShape(LudumOriginalShape.STAR, onPressGuessButton)}
        {buttonForShape(LudumOriginalShape.DIAMOND, onPressGuessButton)}
        {buttonForShape(LudumOriginalShape.SQUARE, onPressGuessButton)}
        {buttonForShape(LudumOriginalShape.TRIANGLE, onPressGuessButton)}
        <Button onClick={() => onBackspace()}>
          <FontAwesomeIcon icon={faBackspace} size="lg" />
        </Button>
      </div>
    </div>
  );
};

export default LudumOriginalMinigameSimonSays;
