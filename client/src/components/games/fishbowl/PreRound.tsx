import React, { useCallback, ReactNode } from 'react';
import {
  FishbowlGameState,
  FishbowlGameType,
} from '@server/store/games/fishbowl/types';
import useSelector from 'store/use-selector';
import { getCurrentUser } from 'store/selectors';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { fshStartRound } from '@server/store/games/fishbowl/actions';
import { sendMessage } from 'store/websocket/actions';
import styles from './PreRound.module.css';

export interface PreRoundProps {
  game: FishbowlGameState;
}

const getGameMessage = (gameType: FishbowlGameType): ReactNode => {
  switch (gameType) {
    case FishbowlGameType.TABOO:
      return (
        <>
          This round is <strong>Taboo</strong>. Describe the phrase without
          using any part of the phrase in your description!
        </>
      );
    case FishbowlGameType.CHARADES:
      return (
        <>
          This round is <strong>Charades</strong>. Act out the phrase, and no
          noises allowed!
        </>
      );
    case FishbowlGameType.PASSWORD:
      return (
        <>
          This round is <strong>Password</strong>. Use only one word to describe
          your phrase! This is the last round.
        </>
      );
  }
};

const PreRound: React.FC<PreRoundProps> = ({ game }) => {
  const currentUser = useSelector(getCurrentUser());
  const dispatch = useDispatch();

  const onStartRoundClick = useCallback(() => {
    dispatch(sendMessage(fshStartRound(Date.now())));
  }, [dispatch]);

  const isActivePlayer = currentUser?.id === game.activePlayer.userId;
  const currentPlayer = game.players.find(p => p.userId === currentUser?.id);
  const isOnSameTeamAsActivePlayer =
    currentPlayer?.team === game.activePlayer.team;

  return (
    <div>
      <div className={styles.nextTurnInfo}>
        It's <strong>{game.activePlayer.teamDisplayName}'s</strong> turn, and{' '}
        <strong>{game.activePlayer.name}</strong> is up next.
      </div>
      <div className={styles.gameInfo}>
        {getGameMessage(game.currentGameType)}
      </div>
      {!isActivePlayer && isOnSameTeamAsActivePlayer && (
        <div className={styles.info}>
          <strong>{currentUser?.name}</strong>, you're on{' '}
          <strong>{currentPlayer?.teamDisplayName}</strong>. Get ready!
        </div>
      )}
      {!isActivePlayer && !isOnSameTeamAsActivePlayer && (
        <div className={styles.info}>
          <strong>{currentUser?.name}</strong>, you're on{' '}
          <strong>{currentPlayer?.teamDisplayName}</strong>. Your team isn't
          guessing this round.
        </div>
      )}
      {isActivePlayer && (
        <>
          <div className={styles.info}>
            <strong>{currentUser?.name}</strong>, you're giving clues next.
          </div>
          <Button onClick={onStartRoundClick} fullWidth>
            Start round
          </Button>
        </>
      )}
    </div>
  );
};

export default PreRound;
