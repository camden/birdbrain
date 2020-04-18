import React, { useState } from 'react';
import { LudumGameState } from '@server/store/games/ludum-dare/types';
import useInterval from 'use-interval';
import { MINIGAME_DURATION_MS } from '@server/store/games/ludum-dare';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { ludumReportEndMinigame } from '@server/store/games/ludum-dare/actions';

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
    const timeLeftSeconds = Math.floor(timeLeftMs / 1000);

    setTimeLeft(timeLeftSeconds);

    if (timeLeftMs <= 0) {
      dispatch(sendMessage(ludumReportEndMinigame()));
    }
  }, 1000);

  return (
    <div>
      <div>playing the game</div>
      <div>{timeLeft} seconds left</div>
    </div>
  );
};

export default LudumPlayMinigame;
