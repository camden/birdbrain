import React, { useCallback } from 'react';
import { LudumGameState } from '@server/store/games/ludum-dare/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { ludumStartMinigame } from '@server/store/games/ludum-dare/actions';

export interface LudumPreMinigameProps {
  game: LudumGameState;
}

const LudumPreMinigame: React.FC<LudumPreMinigameProps> = ({ game }) => {
  const dispatch = useDispatch();

  const onStartClick = useCallback(() => {
    const currentTime = Date.now();
    dispatch(sendMessage(ludumStartMinigame(currentTime)));
  }, [dispatch]);

  return (
    <div>
      <div>Round {game.roundNumber}</div>
      <div>uh oh looks like Zooboo wants help with something...</div>
      <div>🌝</div>
      <Button onClick={onStartClick}>start game</Button>
    </div>
  );
};

export default LudumPreMinigame;
