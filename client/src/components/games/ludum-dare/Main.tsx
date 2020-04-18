import React from 'react';
import {
  LudumGameState,
  LudumPhase,
} from '@server/store/games/ludum-dare/types';
import LudumIntro from './Intro';

export interface LudumMainProps {
  game: LudumGameState;
}

const LudumMain: React.FC<LudumMainProps> = ({ game }) => {
  switch (game.phase) {
    case LudumPhase.INTRO:
      return <LudumIntro game={game} />;
    default:
      return <div>no state found for phase {game.phase}</div>;
  }
};

export default LudumMain;
