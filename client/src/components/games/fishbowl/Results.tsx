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
  }, []);

  return (
    <div>
      <h2>Results</h2>
      {game.activePlayer.name} was giving the clues.
      <h3>Got:</h3>
      {game.answersGot.map(answer => (
        <div key={answer}>{answer}</div>
      ))}
      <h3>Skipped:</h3>
      {game.answersSkipped.map(answer => (
        <div key={answer}>{answer}</div>
      ))}
      {!acked && (
        <Button secondary onClick={onContinueClick}>
          Continue
        </Button>
      )}
    </div>
  );
};

export default Results;
