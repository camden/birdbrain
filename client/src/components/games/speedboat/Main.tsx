import React from 'react';
import { SpeedboatGameState } from '@server/store/games/speedboat/types';
import { speedboatDummyAction } from '@server/store/games/speedboat/actions';
import { useDispatch } from 'react-redux';
import Button from 'components/shared/button/Button';
import { sendMessage } from 'store/websocket/actions';

export interface SpeedboatMainProps {
  game: SpeedboatGameState;
}

const SpeedboatMain: React.FC<SpeedboatMainProps> = () => {
  const dispatch = useDispatch();

  return (
    <div>
      speedboat...
      <Button
        onClick={() => dispatch(sendMessage(speedboatDummyAction('cam')))}
      >
        click me to dispatch
      </Button>
    </div>
  );
};

export default SpeedboatMain;
