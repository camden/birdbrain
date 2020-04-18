import React from 'react';
import {
  LudumGameState,
  LudumPhase,
} from '@server/store/games/ludum-dare/types';
import LudumIntro from './Intro';
import LudumPreMinigame from './PreMinigame';
import LudumPlayMinigame from './PlayMinigame';

export interface LudumMainProps {
  game: LudumGameState;
}

const LudumMain: React.FC<LudumMainProps> = ({ game }) => {
  switch (game.phase) {
    case LudumPhase.INTRO:
      return <LudumIntro game={game} />;
    case LudumPhase.PRE_MINIGAME:
      return <LudumPreMinigame game={game} />;
    case LudumPhase.PLAY_MINIGAME:
      return <LudumPlayMinigame game={game} />;
    default:
      return <div>no state found for phase {game.phase}</div>;
  }
};

export default LudumMain;
