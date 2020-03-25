import React, { useState } from 'react';
import { FishbowlGameState } from '@server/store/games/fishbowl/types';
import useInterval from 'use-interval';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { fshReportEndOfRound } from '@server/store/games/fishbowl/actions';

export interface GuessingProps {
  game: FishbowlGameState;
}

const Guessing: React.FC<GuessingProps> = ({ game }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const dispatch = useDispatch();

  useInterval(() => {
    if (!game.roundEndTime) {
      throw new Error('RoundEndTime should be set.');
    }

    const timeLeftMs = game.roundEndTime - Date.now();
    const timeLeftSeconds = Math.floor(timeLeftMs / 1000);

    setTimeLeft(timeLeftSeconds);

    if (timeLeftSeconds <= 0) {
      dispatch(sendMessage(fshReportEndOfRound()));
    }
  }, 1000);

  return (
    <div>
      <h2>{game.activePlayer.name} is guessing!</h2>
      <div>time left: {timeLeft}s</div>
    </div>
  );
};

export default Guessing;
