import React, { useCallback } from 'react';
import { LudumGameState } from '@server/store/games/ludum-dare/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { ludumStartMinigame } from '@server/store/games/ludum-dare/actions';
import styles from './PreMinigame.module.css';
import LudumCharacter, { CharacterType } from './Character';
import { useCurrentPlayer } from 'utils/ludum-dare-utils';
import LudumPlayerInfo from './PlayerInfo';

export interface LudumPreMinigameProps {
  game: LudumGameState;
}

const LudumPreMinigame: React.FC<LudumPreMinigameProps> = ({ game }) => {
  const dispatch = useDispatch();
  const currentPlayer = useCurrentPlayer(game);

  const onStartClick = useCallback(() => {
    const currentTime = Date.now();
    dispatch(sendMessage(ludumStartMinigame(currentTime)));
  }, [dispatch]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.roundInfo}>
        <div className={styles.roundLabel}>Round</div>
        <div className={styles.roundNumber}>{game.roundNumber}</div>
      </div>
      <div>Next game: {game.currentMinigame}</div>
      {game.players.map((player) => (
        <LudumPlayerInfo
          key={player.userId}
          player={player}
          className={styles.playerInfo}
        />
      ))}
      <div className={styles.footer}>
        <Button onClick={onStartClick}>start game</Button>
      </div>
    </div>
  );
};

export default LudumPreMinigame;
