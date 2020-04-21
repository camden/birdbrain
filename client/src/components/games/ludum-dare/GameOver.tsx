import React, { useCallback } from 'react';
import {
  LudumGameState,
  LudumPlayer,
} from '@server/store/games/ludum-dare/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { ludumAck } from '@server/store/games/ludum-dare/actions';
import styles from './GameOver.module.css';
import { useCurrentPlayer } from 'utils/ludum-dare-utils';
import LudumCharacter, { CharacterType, CharacterAnimation } from './Character';
import { identity, times } from 'ramda';
import LudumHeart from './Heart';
import cx from 'classnames';
import WaitingMessage from 'components/shared/WaitingMessage';

export interface LudumGameOverProps {
  game: LudumGameState;
}

const LudumGameOver: React.FC<LudumGameOverProps> = ({ game }) => {
  const dispatch = useDispatch();
  const currentPlayer = useCurrentPlayer(game);

  const onContinueClick = useCallback(() => {
    dispatch(sendMessage(ludumAck()));
  }, [dispatch]);

  const playersWhoPassed: LudumPlayer[] = game.players.filter((p) =>
    game.playersWhoPassedCurrentMinigame.includes(p.userId)
  );

  const currentPlayerAcked = game.acknowledged.includes(currentPlayer.userId);
  const playersWhoNeedToAck = game.players.filter(
    (p) => !game.acknowledged.includes(p.userId)
  );

  const winningPlayer = game.players.find((p) => p.health > 0);
  if (!winningPlayer) {
    return (
      <div>
        something went wrong, expected to find a winning player. contact
        @camdenbickel
      </div>
    );
  }

  const playerHealth = winningPlayer.health;

  const characterName = (
    <span style={{ color: winningPlayer.character.color }}>
      {winningPlayer.character.name}
    </span>
  );

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Game Over!</h1>
      <h2>
        {winningPlayer.name} and {characterName} won!
      </h2>
      <LudumCharacter
        id={winningPlayer.character.id}
        type={CharacterType.WIN}
        animation={CharacterAnimation.SWAY}
      />
      <div className={styles.heartsContainer}>
        {times(identity, 3).map((idx) => (
          <div key={idx} className={cx(styles.heartWrapper)}>
            <LudumHeart className={styles.heart} empty={idx >= playerHealth} />
          </div>
        ))}
      </div>
      <p className={styles.roundNumberAnnouncement}>
        You made it to <strong>Round {game.roundNumber}</strong>!
      </p>
      <div className={styles.footer}>
        {currentPlayerAcked && (
          <WaitingMessage
            playersThatNeedToAct={playersWhoNeedToAck.map((p) => p.name)}
            verb={'continue'}
          />
        )}
        {!currentPlayerAcked && (
          <Button onClick={onContinueClick}>Return to Room</Button>
        )}
      </div>
    </div>
  );
};

export default LudumGameOver;
