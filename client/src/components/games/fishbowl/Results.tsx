import React from 'react';
import { FishbowlGameState } from '@server/store/games/fishbowl/types';

export interface ResultsProps {
  game: FishbowlGameState;
}

const Results: React.FC<ResultsProps> = ({ game }) => {
  return <div>Results</div>;
};

export default Results;
