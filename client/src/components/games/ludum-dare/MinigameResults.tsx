import React from 'react';
import { LudumGameState } from '@server/store/games/ludum-dare/types';

export interface LudumMinigameResultsProps {
  game: LudumGameState;
}

const LudumMinigameResults: React.FC<LudumMinigameResultsProps> = ({
  game,
}) => {
  return <div>nice the game is over. good job</div>;
};

export default LudumMinigameResults;
