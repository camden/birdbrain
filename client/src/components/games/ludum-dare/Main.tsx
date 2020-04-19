import React from 'react';
import {
  LudumGameState,
  LudumPhase,
} from '@server/store/games/ludum-dare/types';
import LudumIntro from './Intro';
import LudumPreMinigame from './PreMinigame';
import LudumPlayMinigame from './PlayMinigame';
import LudumMinigameResults from './MinigameResults';
import styles from './Main.module.css';

export interface LudumMainProps {
  game: LudumGameState;
}

const Game: React.FC<LudumMainProps> = ({ game }) => {
  switch (game.phase) {
    case LudumPhase.INTRO:
      return <LudumIntro game={game} />;
    case LudumPhase.PRE_MINIGAME:
      return <LudumPreMinigame game={game} />;
    case LudumPhase.PLAY_MINIGAME:
      return <LudumPlayMinigame game={game} />;
    case LudumPhase.MINIGAME_RESULTS:
      return <LudumMinigameResults game={game} />;
    default:
      return <div>no state found for phase {game.phase}</div>;
  }
};

const LudumMain: React.FC<LudumMainProps> = ({ game }) => {
  return (
    <div className={styles.wrapper}>
      <Game game={game} />
    </div>
  );
};

export default LudumMain;
