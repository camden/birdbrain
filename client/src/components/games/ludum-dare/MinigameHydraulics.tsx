import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  LudumGameState,
  LudumMinigameHydraulicsState,
} from '@server/store/games/ludum-dare/types';
import { useCurrentPlayer } from 'utils/ludum-dare-utils';
import styles from './MinigameHydraulics.module.css';
import Button from 'components/shared/button/Button';

export interface LudumMinigameHydraulicsProps {
  game: LudumGameState;
  minigame: LudumMinigameHydraulicsState;
}

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

  const onButtonPress = (columns: (0 | 1 | 2)[], value: number) => {
    let newPipes: [number, number, number] = [...pipes] as [
      number,
      number,
      number
    ];

    for (let i = 0; i < columns.length; i++) {
      const idxToUpdate = columns[i];
      newPipes[idxToUpdate] = Math.min(
        minigame.pipeMaxLevel,
        Math.max(0, newPipes[idxToUpdate] + value)
      );
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
        <Button
          className={styles.cols110}
          onClick={() => onButtonPress([0, 1], +2)}
        >
          +2
        </Button>
        <Button
          className={styles.cols011}
          onClick={() => onButtonPress([1, 2], -1)}
        >
          -1
        </Button>
        <Button
          className={styles.cols111}
          onClick={() => onButtonPress([0, 1, 2], -1)}
        >
          -1
        </Button>
        <Button
          className={styles.cols001}
          onClick={() => onButtonPress([2], +3)}
        >
          +3
        </Button>
        <Button
          className={styles.cols011}
          onClick={() => onButtonPress([1, 2], +2)}
        >
          +2
        </Button>
        <Button className={styles.cols111} onClick={() => setPipes([0, 0, 0])}>
          Set to 0
        </Button>
      </div>
    </div>
  );
};

export default LudumMinigameHydraulics;
