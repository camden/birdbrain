import React from 'react';
import { PongGameState } from '@server/store/games/pong/types';

export interface PongMainProps {
  game: PongGameState;
}

const PongMain: React.FC<PongMainProps> = ({ game }) => {
  return <div>pong</div>;
};

export default PongMain;
