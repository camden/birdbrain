import React, { useCallback } from 'react';
import {
  LudumOriginalGameState,
  LudumOriginalPlayer,
} from '@server/store/games/ludum-dare-original/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { ludumOriginalAck } from '@server/store/games/ludum-dare-original/actions';
import styles from './MinigameResults.module.css';
import { useCurrentPlayer } from 'utils/ludum-dare-original-utils';
import LudumOriginalCharacter, {
  CharacterType,
  CharacterAnimation,
} from './Character';
import { identity, times } from 'ramda';
import LudumOriginalHeart from './Heart';
import cx from 'classnames';
import WaitingMessage from 'components/shared/WaitingMessage';

export interface LudumOriginalMinigameResultsProps {
  game: LudumOriginalGameState;
}

const LudumOriginalMinigameResults: React.FC<LudumOriginalMinigameResultsProps> = ({
  game,
}) => {
  const dispatch = useDispatch();
  const currentPlayer = useCurrentPlayer(game);

  const onContinueClick = useCallback(() => {
    dispatch(sendMessage(ludumOriginalAck()));
  }, [dispatch]);

  const playersWhoPassed: LudumOriginalPlayer[] = game.players.filter((p) =>
    game.playersWhoPassedCurrentMinigame.includes(p.userId)
  );
  const currentPlayerPassed = game.playersWhoPassedCurrentMinigame.includes(
    currentPlayer.userId
  );
  const currentPlayerAcked = game.acknowledged.includes(currentPlayer.userId);
  const playersWhoNeedToAck = game.players
    .filter((p) => !game.acknowledged.includes(p.userId))
    .filter((p) => p.health > 0);

  const playerHealth = currentPlayerPassed
    ? currentPlayer.health
    : currentPlayer.health + 1;

  return (
    <div className={styles.wrapper}>
      <h1>{currentPlayerPassed ? 'You did it!' : 'You failed.'}</h1>
      <LudumOriginalCharacter
        id={currentPlayer.character.id}
        type={currentPlayerPassed ? CharacterType.WIN : CharacterType.LOSE}
        typeWhenPressed={
          currentPlayerPassed ? CharacterType.WIN : CharacterType.NERVOUS
        }
        animation={
          currentPlayerPassed
            ? CharacterAnimation.SWAY
            : CharacterAnimation.SHAKE
        }
      />
      <div className={styles.heartsContainer}>
        {times(identity, playerHealth).map((idx) => (
          <div
            key={idx}
            className={cx(styles.heartWrapper, {
              [styles.missingHeart]:
                !currentPlayerPassed && idx === playerHealth - 1,
            })}
          >
            <LudumOriginalHeart className={styles.heart} />
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        {currentPlayerAcked && (
          <WaitingMessage
            playersThatNeedToAct={playersWhoNeedToAck.map((p) => p.name)}
            verb={'move on'}
          />
        )}
        {!currentPlayerAcked && (
          <Button onClick={onContinueClick}>Continue</Button>
        )}
      </div>
    </div>
  );
};

export default LudumOriginalMinigameResults;
