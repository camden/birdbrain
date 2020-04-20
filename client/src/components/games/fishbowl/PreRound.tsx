import React, { useCallback, ReactNode } from 'react';
import {
  FishbowlGameState,
  FishbowlGameType,
  FishbowlTeam,
} from '@server/store/games/fishbowl/types';
import useSelector from 'store/use-selector';
import { getCurrentUser } from 'store/selectors';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { fshStartRound } from '@server/store/games/fishbowl/actions';
import { sendMessage } from 'store/websocket/actions';
import styles from './PreRound.module.css';
import TeamBar from './TeamBar';
import cx from 'classnames';
import WaitingMessage from 'components/shared/WaitingMessage';

export interface PreRoundProps {
  game: FishbowlGameState;
}

const getGameName = (gameType: FishbowlGameType): string => {
  switch (gameType) {
    case FishbowlGameType.TABOO:
      return 'Taboo';
    case FishbowlGameType.CHARADES:
      return 'Charades';
    case FishbowlGameType.PASSWORD:
      return 'Password';
  }
};

const getGameMessage = (gameType: FishbowlGameType): ReactNode => {
  switch (gameType) {
    case FishbowlGameType.TABOO:
      return (
        <>
          Describe the phrase without using any part of the phrase in your
          description!
        </>
      );
    case FishbowlGameType.CHARADES:
      return <>Act out the phrase, and no noises allowed!</>;
    case FishbowlGameType.PASSWORD:
      return (
        <>Use only one word to describe your phrase! This is the last round.</>
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
  const currentPlayer = game.players.find((p) => p.userId === currentUser?.id);

  if (!currentUser) {
    return <div>Something went wrong! Can't find current user. ERROR #1</div>;
  }

  if (!currentPlayer) {
    return (
      <div>
        Something went wrong! Can't find player for current user. ERROR #2
      </div>
    );
  }

  if (!currentPlayer.teamDisplayName) {
    return (
      <div>
        Something went wrong! Can't find team for current player. ERROR #3
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <TeamBar team={currentPlayer.team} playerName={currentPlayer.name} />
      <section>
        <h2 className={styles.subtitle}>Up Next:</h2>
        <div className={styles.nextPlayerName}>{game.activePlayer.name}</div>
        <div
          className={cx(styles.nextTeamName, {
            [styles.teamA]: game.activePlayer.team === FishbowlTeam.TEAM_A,
            [styles.teamB]: game.activePlayer.team === FishbowlTeam.TEAM_B,
          })}
        >
          {game.activePlayer.teamDisplayName}
        </div>
      </section>
      <section className={styles.gameInfo}>
        <h2 className={styles.subtitle}>Game Mode:</h2>
        <div className={styles.gameModeName}>
          {getGameName(game.currentGameType)}
        </div>
        <div className={styles.gameModeDescription}>
          {getGameMessage(game.currentGameType)}
        </div>
      </section>
      <section className={styles.bottomArea}>
        {!isActivePlayer && (
          <WaitingMessage
            playersThatNeedToAct={[game.activePlayer.name]}
            verb={'start the round'}
          />
        )}
        {isActivePlayer && (
          <Button onClick={onStartRoundClick} fullWidth>
            Start round
          </Button>
        )}
      </section>
    </div>
  );
};

export default PreRound;
