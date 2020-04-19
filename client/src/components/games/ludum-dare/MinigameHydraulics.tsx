import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  LudumGameState,
  LudumMinigameHydraulicsState,
  LudumMinigameHydraulicsButton,
} from '@server/store/games/ludum-dare/types';
import { useCurrentPlayer } from 'utils/ludum-dare-utils';
import styles from './MinigameHydraulics.module.css';
import Button from 'components/shared/button/Button';

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
    case '001':
      return styles.cols001;
    case '100':
      return styles.cols100;
    case '010':
      return styles.cols010;
    case '001':
      return styles.cols001;
    default:
      console.error('Unexpected button config!');
      return '';
  }
};

const LudumMinigameHydraulics: React.FC<LudumMinigameHydraulicsProps> = ({
  game,
  minigame,
}) => {
  const dispatch = useDispatch();
  const currentPlayer = useCurrentPlayer(game);
  const [pipes, setPipes] = useState<[number, number, number]>([0, 0, 0]);

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

    setPipes(newPipes);
  };

  return (
    <div className={styles.wrapper}>
      {passedMinigame && <strong>Congrats! You got the right answer</strong>}
      <div className={styles.pipeWrapper}>
        <div className={styles.pipe}>{minigame.correctResult[0]}</div>
        <div className={styles.pipe}>{minigame.correctResult[1]}</div>
        <div className={styles.pipe}>{minigame.correctResult[2]}</div>
      </div>
      <div className={styles.pipeWrapper}>
        <div className={styles.pipe}>{pipes[0]}</div>
        <div className={styles.pipe}>{pipes[1]}</div>
        <div className={styles.pipe}>{pipes[2]}</div>
      </div>
      <div className={styles.pipeWrapper}>
        {minigame.buttons.map((b) => (
          <Button
            key={b[0] + b[1].join()}
            className={getClassNameForButton(b)}
            onClick={() => onButtonPress(b)}
          >
            {b[0] > 0 ? '+' : ''}
            {b[0]}
          </Button>
        ))}
        <Button
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
