import React from 'react';
import { ScoreCounterGameState } from '@server/store/games/score-counter/types';
import { scoreCounterDummyAction } from '@server/store/games/score-counter/actions';
import { useDispatch } from 'react-redux';
import Button from 'components/shared/button/Button';
import { sendMessage } from 'store/websocket/actions';

export interface ScoreCounterMainProps {
  game: ScoreCounterGameState;
}

const ScoreCounterMain: React.FC<ScoreCounterMainProps> = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <Button
        onClick={() => dispatch(sendMessage(scoreCounterDummyAction('cam')))}
      >
        click me to dispatch
      </Button>
    </div>
  );
};

export default ScoreCounterMain;
