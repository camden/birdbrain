import React, { useState, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import {
  LudumGameState,
  LudumMinigameHydraulicsState,
  LudumMinigameHydraulicsButton,
} from '@server/store/games/ludum-dare/types';
import { useCurrentPlayer } from 'utils/ludum-dare-utils';
import styles from './MinigameHydraulics.module.css';
import Button from 'components/shared/button/Button';
import { sendMessage } from 'store/websocket/actions';
import { ludumCheckMinigameAnswer } from '@server/store/games/ludum-dare/actions';
import pipe0 from 'assets/images/ludum-dare/gui/pipes/pipe0.png';
import pipe1 from 'assets/images/ludum-dare/gui/pipes/pipe1.png';
import pipe2 from 'assets/images/ludum-dare/gui/pipes/pipe2.png';
import pipe3 from 'assets/images/ludum-dare/gui/pipes/pipe3.png';
import pipe4 from 'assets/images/ludum-dare/gui/pipes/pipe4.png';
import cx from 'classnames';

export interface LudumMinigameHydraulicsProps {
  game: LudumGameState;
  minigame: LudumMinigameHydraulicsState;
}

const getClassNameForButton = (
  button: LudumMinigameHydraulicsButton
): string => {
  const buttonAsString = button[1].map((bool) => (bool ? 1 : 0)).join('');
  switch (buttonAsString) {
    case '111':
      return styles.cols111;
    case '110':
      return styles.cols110;
    case '011':
      return styles.cols011;
    case '100':
      return styles.cols100;
    case '010':
      return styles.cols010;
    case '001':
      return styles.cols001;
    default:
      console.error('Unexpected button config!' + buttonAsString);
      return '';
  }
};

const getPipeForValue = (value: number): ReactNode => {
  let imgSrc;

  switch (value) {
    case 0:
      imgSrc = pipe0;
      break;
    case 1:
      imgSrc = pipe1;
      break;
    case 2:
      imgSrc = pipe2;
      break;
    case 3:
      imgSrc = pipe3;
      break;
    case 4:
      imgSrc = pipe4;
      break;
  }

  return (
    <div className={styles.pipeWrapper}>
      <img src={imgSrc} className={styles.pipeImg} />
    </div>
  );
};

const LudumMinigameHydraulics: React.FC<LudumMinigameHydraulicsProps> = ({
  game,
  minigame,
}) => {
  const dispatch = useDispatch();
  const currentPlayer = useCurrentPlayer(game);
  const [pipes, setPipes] = useState<[number, number, number]>(
    minigame.startingResult
  );

  const passedMinigame = game.playersWhoPassedCurrentMinigame.includes(
    currentPlayer.userId
  );

  const onButtonPress = (button: LudumMinigameHydraulicsButton) => {
    let newPipes: [number, number, number] = [...pipes] as [
      number,
      number,
      number
    ];

    const value = button[0];
    const columns = button[1];

    for (let i = 0; i < 3; i++) {
      const isAffected = columns[i];
      if (isAffected) {
        newPipes[i] = Math.min(
          minigame.pipeMaxLevel,
          Math.max(0, newPipes[i] + value)
        );
      }
    }

    dispatch(sendMessage(ludumCheckMinigameAnswer(newPipes)));

    setPipes(newPipes);
  };

  return (
    <div className={styles.wrapper}>
      {passedMinigame && <strong>Congrats! You got the right answer</strong>}
      <h3>Goal:</h3>
      <div className={styles.pipeRowWrapper}>
        {getPipeForValue(minigame.correctResult[0])}
        {getPipeForValue(minigame.correctResult[1])}
        {getPipeForValue(minigame.correctResult[2])}
      </div>
      <h3>Current:</h3>
      <div className={styles.pipeRowWrapper}>
        {getPipeForValue(pipes[0])}
        {getPipeForValue(pipes[1])}
        {getPipeForValue(pipes[2])}
      </div>
      <div className={styles.pipeRowWrapper}>
        {minigame.buttons.map((b) => (
          <Button
            secondary
            small
            key={b[0] + b[1].join()}
            className={cx(styles.pipeButton, getClassNameForButton(b))}
            onClick={() => onButtonPress(b)}
          >
            {b[0] > 0 ? '+' : ''}
            {b[0]}
          </Button>
        ))}
        <Button
          small
          className={styles.cols111}
          onClick={() => setPipes(minigame.startingResult)}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default LudumMinigameHydraulics;
