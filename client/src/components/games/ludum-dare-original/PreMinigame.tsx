import React, { useCallback } from 'react';
import {
  LudumOriginalGameState,
  LudumOriginalMinigame,
} from '@server/store/games/ludum-dare-original/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { ludumOriginalStartMinigame } from '@server/store/games/ludum-dare-original/actions';
import styles from './PreMinigame.module.css';
import { useCurrentPlayer } from 'utils/ludum-dare-original-utils';
import LudumOriginalPlayerInfo from './PlayerInfo';
import WaitingMessage from 'components/shared/WaitingMessage';

export interface LudumOriginalPreMinigameProps {
  game: LudumOriginalGameState;
}

const getNameOfMinigame = (minigame: LudumOriginalMinigame): string => {
  switch (minigame) {
    case LudumOriginalMinigame.PIZZA:
      return 'Pizza Perfection';
    case LudumOriginalMinigame.HYDRAULICS:
      return 'Measure Up';
    case LudumOriginalMinigame.SIMON_SAYS:
      return 'Copycat';
    default:
      return '';
  }
};

const LudumOriginalPreMinigame: React.FC<LudumOriginalPreMinigameProps> = ({
  game,
}) => {
  const dispatch = useDispatch();
  const currentPlayer = useCurrentPlayer(game);

  const onStartClick = useCallback(() => {
    const currentTime = Date.now();
    dispatch(sendMessage(ludumOriginalStartMinigame(currentTime)));
  }, [dispatch]);

  const currentPlayerAcked = game.acknowledged.includes(currentPlayer.userId);
  const playersWhoNeedToAck = game.players
    .filter((p) => !game.acknowledged.includes(p.userId))
    .filter((p) => p.health > 0);

  if (!game.currentMinigame) {
    return <div>expected minigame to exist. please contact @camdenbickel</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.roundInfo}>
        <div className={styles.roundLabel}>Round</div>
        <div className={styles.roundNumber}>{game.roundNumber}</div>
      </div>
      <div className={styles.nextGame}>
        Next game: {getNameOfMinigame(game.currentMinigame)}!
      </div>
      <div className={styles.allPlayers}>
        {game.players.map((player) => (
          <LudumOriginalPlayerInfo
            key={player.userId}
            player={player}
            className={styles.playerInfo}
          />
        ))}
      </div>
      <div className={styles.footer}>
        {currentPlayerAcked && (
          <WaitingMessage
            playersThatNeedToAct={playersWhoNeedToAck.map((p) => p.name)}
            verb={'start the game'}
          />
        )}
        {!currentPlayerAcked && (
          <Button onClick={onStartClick}>start game</Button>
        )}
      </div>
    </div>
  );
};

export default LudumOriginalPreMinigame;
