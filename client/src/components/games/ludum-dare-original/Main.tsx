import React from 'react';
import {
  LudumOriginalGameState,
  LudumOriginalPhase,
} from '@server/store/games/ludum-dare-original/types';
import LudumOriginalIntro from './Intro';
import LudumOriginalPreMinigame from './PreMinigame';
import LudumOriginalPlayMinigame from './PlayMinigame';
import LudumOriginalMinigameResults from './MinigameResults';
import styles from './Main.module.css';
import LudumOriginalYouDied from './YouDied';
import { useCurrentPlayer } from 'utils/ludum-dare-original-utils';
import LudumOriginalGameOver from './GameOver';

export interface LudumOriginalMainProps {
  game: LudumOriginalGameState;
}

const Game: React.FC<LudumOriginalMainProps> = ({ game }) => {
  const currentPlayer = useCurrentPlayer(game);

  if (
    currentPlayer.health === 0 &&
    game.phase !== LudumOriginalPhase.GAME_OVER
  ) {
    return <LudumOriginalYouDied game={game} />;
  }

  switch (game.phase) {
    case LudumOriginalPhase.INTRO:
      return <LudumOriginalIntro game={game} />;
    case LudumOriginalPhase.PRE_MINIGAME:
      return <LudumOriginalPreMinigame game={game} />;
    case LudumOriginalPhase.PLAY_MINIGAME:
      return <LudumOriginalPlayMinigame game={game} />;
    case LudumOriginalPhase.MINIGAME_RESULTS:
      return <LudumOriginalMinigameResults game={game} />;
    case LudumOriginalPhase.GAME_OVER:
      return <LudumOriginalGameOver game={game} />;
    default:
      return <div>no state found for phase {game.phase}</div>;
  }
};

const LudumOriginalMain: React.FC<LudumOriginalMainProps> = ({ game }) => {
  return (
    <div className={styles.wrapper}>
      <Game game={game} />
    </div>
  );
};

export default LudumOriginalMain;
