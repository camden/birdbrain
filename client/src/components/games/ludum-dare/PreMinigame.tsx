import React, { useCallback } from 'react';
import { LudumGameState } from '@server/store/games/ludum-dare/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { ludumAck } from '@server/store/games/ludum-dare/actions';

export interface LudumPreMinigameProps {
  game: LudumGameState;
}

const LudumPreMinigame: React.FC<LudumPreMinigameProps> = ({ game }) => {
  const dispatch = useDispatch();

  const onStartClick = useCallback(() => {
    dispatch(sendMessage(ludumAck()));
  }, [dispatch]);

  return (
    <div>
      <div>uh oh looks like Zooboo wants help with something...</div>
      <div>🌝</div>
      <Button onClick={onStartClick}>start game</Button>
    </div>
  );
};

export default LudumPreMinigame;
