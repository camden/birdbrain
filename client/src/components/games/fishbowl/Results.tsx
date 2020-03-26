import React, { useState, useCallback } from 'react';
import { FishbowlGameState } from '@server/store/games/fishbowl/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { fshAckResults } from '@server/store/games/fishbowl/actions';

export interface ResultsProps {
  game: FishbowlGameState;
}

const Results: React.FC<ResultsProps> = ({ game }) => {
  const dispatch = useDispatch();
  const [acked, setAcked] = useState(false);

  const onContinueClick = useCallback(() => {
    dispatch(sendMessage(fshAckResults()));
    setAcked(true);
  }, [dispatch]);

  return (
    <div>
      <h2>Round Results</h2>
      <strong>{game.activePlayer.name}</strong> was giving the clues.
      <h3>Got:</h3>
      {game.answersGot.map(answer => (
        <div key={answer}>{answer}</div>
      ))}
      <h3>Skipped {game.answersSkipped.length}.</h3>
      {!acked && (
        <Button secondary onClick={onContinueClick} fullWidth>
          Continue
        </Button>
      )}
    </div>
  );
};

export default Results;
