import React, { useCallback } from 'react';
import { LudumGameState } from '@server/store/games/ludum-dare/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { ludumAckIntro } from '@server/store/games/ludum-dare/actions';

export interface LudumIntroProps {
  game: LudumGameState;
}

const LudumIntro: React.FC<LudumIntroProps> = ({ game }) => {
  const dispatch = useDispatch();

  const onContinueClick = useCallback(() => {
    dispatch(sendMessage(ludumAckIntro()));
  }, [dispatch]);

  return (
    <div>
      intro!
      <Button onClick={onContinueClick}>got it!</Button>
    </div>
  );
};

export default LudumIntro;
