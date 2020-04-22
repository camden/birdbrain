import React, { useState, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import {
  LudumGameState,
  LudumMinigameHydraulicsState,
  LudumMinigameHydraulicsButton,
  LudumMinigameHydraulicsResult,
  LudumMinigame,
} from '@server/store/games/ludum-dare/types';
import { useCurrentPlayer } from 'utils/ludum-dare-utils';
import styles from './MinigameHydraulics.module.css';
import Button from 'components/shared/button/Button';
import cx from 'classnames';
import { sendMessage } from 'store/websocket/actions';
import { ludumCheckMinigameAnswer } from '@server/store/games/ludum-dare/actions';
import pipe0 from 'assets/images/ludum-dare/gui/pipes/pipe0.png';
import pipe1 from 'assets/images/ludum-dare/gui/pipes/pipe1.png';
import pipe2 from 'assets/images/ludum-dare/gui/pipes/pipe2.png';
import pipe3 from 'assets/images/ludum-dare/gui/pipes/pipe3.png';
import pipe4 from 'assets/images/ludum-dare/gui/pipes/pipe4.png';
import { faCheck, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface LudumMinigameHydraulicsProps {
  game: LudumGameState;
  minigame: LudumMinigameHydraulicsState;
}

const getStyleForButton = (
  button: LudumMinigameHydraulicsButton
): React.CSSProperties => {
  let firstSeenIdx;
  let lastSeenIdx = 0;

  for (let i = 0; i < button[1].length; i++) {
    const atIdx = button[1][i];
    if (!!atIdx && firstSeenIdx === undefined) {
      firstSeenIdx = i;
    }

    if (atIdx) {
      lastSeenIdx = i;
    }
  }

  return {
    gridColumnStart: (firstSeenIdx || 0) + 1,
    gridColumnEnd: lastSeenIdx + 2,
  };
};

const getPipeImgForValue = (
  value: number,
  key?: string | number
): ReactNode => {
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
    <div className={styles.pipeWrapper} key={key}>
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
  const [pipes, setPipes] = useState<LudumMinigameHydraulicsResult>(
    minigame.startingResult
  );

  const passedMinigame = game.playersWhoPassedCurrentMinigame.includes(
    currentPlayer.userId
  );

  const onButtonPress = (button: LudumMinigameHydraulicsButton) => {
    let newPipes: LudumMinigameHydraulicsResult = [
      ...pipes,
    ] as LudumMinigameHydraulicsResult;

    const value = button[0];
    const columns = button[1];

    for (let i = 0; i < columns.length; i++) {
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

  const pipeRowStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${minigame.correctResult.length}, 1fr)`,
  };

  const isFirstTimePlaying = !game.minigamesPlayedSoFar.includes(
    LudumMinigame.HYDRAULICS
  );

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.instructions}>Match!</h1>
      {isFirstTimePlaying && (
        <small className={styles.firstTimeInstructions}>
          Use the buttons to make the bottom pipe match the top pipe.
        </small>
      )}
      <div className={styles.pipeRowWrapper} style={pipeRowStyle}>
        {minigame.correctResult.map((pipe, idx) =>
          getPipeImgForValue(pipe, pipe + ' ' + idx)
        )}
      </div>
      <div className={styles.pipeRowWrapper} style={pipeRowStyle}>
        {pipes.map((pipe, idx) => (
          <div className={styles.matchingHintWrapper}>
            {pipe === minigame.correctResult[idx] ? (
              <FontAwesomeIcon icon={faCheck} color="limegreen" />
            ) : (
              <FontAwesomeIcon icon={faTimes} color="red" />
            )}
          </div>
        ))}
      </div>
      <div className={styles.pipeRowWrapper} style={pipeRowStyle}>
        {pipes.map((pipe, idx) => getPipeImgForValue(pipe, pipe + ' ' + idx))}
      </div>
      <div
        className={cx(styles.pipeRowWrapper, styles.buttons)}
        style={pipeRowStyle}
      >
        {minigame.buttons.map((b) => (
          <Button
            secondary
            small
            key={b[0] + b[1].join()}
            className={styles.pipeButton}
            style={getStyleForButton(b)}
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
