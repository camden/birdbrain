import React from 'react';
import { FishbowlGameState } from '@server/store/games/fishbowl/types';

export interface ResultsProps {
  game: FishbowlGameState;
}

const Results: React.FC<ResultsProps> = ({ game }) => {
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
    </div>
  );
};

export default Results;
