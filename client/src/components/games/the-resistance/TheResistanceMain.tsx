import React from 'react';
import { Game } from '@server/store/games/types';

export interface ResistanceProps {
  game: Game;
}

const TheResistanceMain: React.FC<ResistanceProps> = ({ game }) => {
  return <div>resistance</div>;
};

export default TheResistanceMain;
