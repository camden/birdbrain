import React, { useCallback } from 'react';
import {
  LudumGameState,
  LudumPlayer,
} from '@server/store/games/ludum-dare/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { ludumAck } from '@server/store/games/ludum-dare/actions';

export interface LudumMinigameResultsProps {
  game: LudumGameState;
}

const LudumMinigameResults: React.FC<LudumMinigameResultsProps> = ({
  game,
}) => {
  const dispatch = useDispatch();

  const onContinueClick = useCallback(() => {
    dispatch(sendMessage(ludumAck()));
  }, [dispatch]);

  const playersWhoPassed: LudumPlayer[] = game.players.filter((p) =>
    game.playersWhoPassedCurrentMinigame.includes(p.userId)
  );

  return (
    <div>
      <div>nice the game is over. good job</div>
      <p>
        these players were successful:{' '}
        {playersWhoPassed.map((p) => p.name).join(', ')}
      </p>
      <Button onClick={onContinueClick}>play again</Button>
    </div>
  );
};

export default LudumMinigameResults;
