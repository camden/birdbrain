import React, { useCallback } from 'react';
import {
  LudumGameState,
  LudumPlayer,
} from '@server/store/games/ludum-dare/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { ludumAck } from '@server/store/games/ludum-dare/actions';
import styles from './MinigameResults.module.css';
import { useCurrentPlayer } from 'utils/ludum-dare-utils';
import LudumCharacter from './Character';

export interface LudumMinigameResultsProps {
  game: LudumGameState;
}

const LudumMinigameResults: React.FC<LudumMinigameResultsProps> = ({
  game,
}) => {
  const dispatch = useDispatch();
  const currentPlayer = useCurrentPlayer(game);

  const onContinueClick = useCallback(() => {
    dispatch(sendMessage(ludumAck()));
  }, [dispatch]);

  const playersWhoPassed: LudumPlayer[] = game.players.filter((p) =>
    game.playersWhoPassedCurrentMinigame.includes(p.userId)
  );
  const currentPlayerPassed = game.playersWhoPassedCurrentMinigame.includes(
    currentPlayer.userId
  );

  return (
    <div className={styles.wrapper}>
      <div>nice the game is over. good job</div>
      <LudumCharacter id={currentPlayer.character.id} />
      <p>
        these players were successful:{' '}
        {playersWhoPassed.map((p) => p.name).join(', ')}
      </p>
      <div className={styles.footer}>
        <Button onClick={onContinueClick}>Continue</Button>
      </div>
    </div>
  );
};

export default LudumMinigameResults;
