import React from 'react';
import { ScoreCounterGameState } from '@server/store/games/score-counter/types';
import {
  scoreCounterAddAction,
  scoreCounterSetAction,
} from '@server/store/games/score-counter/actions';
import { useDispatch } from 'react-redux';
import Button from 'components/shared/button/Button';
import { sendMessage } from 'store/websocket/actions';
import { getCurrentUser } from 'store/selectors';
import useSelector from 'store/use-selector';
import styles from './Main.module.css';

export interface ScoreCounterMainProps {
  game: ScoreCounterGameState;
}

const AddButton = ({ amount }: { amount: number }) => {
  const dispatch = useDispatch();

  let prefix = '';
  if (amount > 0) {
    prefix = '+';
  }

  const label = `${prefix}${amount}`;

  return (
    <Button
      className={styles.button}
      onClick={() => dispatch(sendMessage(scoreCounterAddAction(amount)))}
      secondary
    >
      {label}
    </Button>
  );
};

const ScoreCounterMain: React.FC<ScoreCounterMainProps> = ({ game }) => {
  const currentUser = useSelector(getCurrentUser());
  const dispatch = useDispatch();

  const currentPlayer = game.players.find((p) => p.userId === currentUser?.id);
  if (!currentPlayer) {
    return (
      <div>
        Something went wrong! Can't find player for current user. ERROR #2
      </div>
    );
  }

  const otherPlayers = game.players.filter((p) => p.userId !== currentUser?.id);

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainNumber}>{currentPlayer.currentCount}</div>
      <div className={styles.allButtons}>
        <div className={styles.buttonColumn}>
          <AddButton amount={-1} />
          <AddButton amount={-10} />
          <AddButton amount={-100} />
          <AddButton amount={-1000} />
        </div>
        <Button
          secondary
          onClick={() => dispatch(sendMessage(scoreCounterSetAction(0)))}
        >
          Reset
        </Button>
        <div className={styles.buttonColumn}>
          <AddButton amount={1} />
          <AddButton amount={10} />
          <AddButton amount={100} />
          <AddButton amount={1000} />
        </div>
      </div>
      <div className={styles.otherScores}>
        <h2>Other Player Scores</h2>
        {otherPlayers.map((p) => (
          <div className={styles.scoreRow}>
            <span className={styles.playerName}>{p.name}</span>👉
            <span className={styles.playerScore}>{p.currentCount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreCounterMain;
