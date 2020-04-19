import React, { useState, ReactNode } from 'react';
import {
  LudumGameState,
  LudumMinigame,
  LudumMinigameSimonSaysState,
  LudumMinigameHydraulicsState,
} from '@server/store/games/ludum-dare/types';
import useInterval from 'use-interval';
import { MINIGAME_DURATION_MS } from '@server/store/games/ludum-dare';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { ludumReportEndMinigame } from '@server/store/games/ludum-dare/actions';
import LudumMinigameSimonSays from './MinigameSimonSays';
import LudumMinigameHydraulics from './MinigameHydraulics';

export interface LudumPlayMinigameProps {
  game: LudumGameState;
}

const LudumPlayMinigame: React.FC<LudumPlayMinigameProps> = ({ game }) => {
  const [timeLeft, setTimeLeft] = useState(
    Math.floor(MINIGAME_DURATION_MS / 1000)
  );
  const dispatch = useDispatch();

  useInterval(() => {
    if (!game.minigameEndTime) {
      throw new Error('RoundEndTime should be set.');
    }

    const timeLeftMs = game.minigameEndTime - Date.now();
    const timeLeftSeconds = Math.max(0, Math.floor(timeLeftMs / 1000));

    setTimeLeft(timeLeftSeconds);

    if (timeLeftMs <= 0) {
      dispatch(sendMessage(ludumReportEndMinigame()));
    }
  }, 1000);

  let minigame: ReactNode = null;
  switch (game.currentMinigame) {
    case LudumMinigame.SIMON_SAYS:
      minigame = (
        <LudumMinigameSimonSays
          game={game}
          minigame={game.currentMinigameState as LudumMinigameSimonSaysState}
        />
      );
    case LudumMinigame.HYDRAULICS:
      minigame = (
        <LudumMinigameHydraulics
          game={game}
          minigame={game.currentMinigameState as LudumMinigameHydraulicsState}
        />
      );
  }

  return (
    <div>
      <div>playing the game {game.currentMinigame}</div>
      <div>{timeLeft} seconds left</div>
      {minigame}
    </div>
  );
};

export default LudumPlayMinigame;
