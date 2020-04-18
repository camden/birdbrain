import React from 'react';
import { LudumGameState } from '@server/store/games/ludum-dare/types';

export interface LudumMainProps {
  game: LudumGameState;
}

const LudumMain: React.FC<LudumMainProps> = ({ game }) => {
  return <div>ludum dare game</div>;
};

export default LudumMain;
