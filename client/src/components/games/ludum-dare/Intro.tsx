import React, { useCallback } from 'react';
import { LudumGameState } from '@server/store/games/ludum-dare/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { ludumAck } from '@server/store/games/ludum-dare/actions';

export interface LudumIntroProps {
  game: LudumGameState;
}

const LudumIntro: React.FC<LudumIntroProps> = ({ game }) => {
  const dispatch = useDispatch();

  const onContinueClick = useCallback(() => {
    dispatch(sendMessage(ludumAck()));
  }, [dispatch]);

  return (
    <div>
      <div>
        this is where a brief intro to your character and a short tutorial might
        go.
      </div>
      <Button onClick={onContinueClick}>got it!</Button>
    </div>
  );
};

export default LudumIntro;