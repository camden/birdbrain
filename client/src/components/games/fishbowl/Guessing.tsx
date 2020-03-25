import React, { useState, useCallback } from 'react';
import { FishbowlGameState } from '@server/store/games/fishbowl/types';
import useInterval from 'use-interval';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import {
  fshReportEndOfRound,
  fshGotAnswer,
  fshSkipAnswer,
} from '@server/store/games/fishbowl/actions';
import Button from 'components/shared/button/Button';
import { getCurrentAnswer } from '@server/store/games/fishbowl/selectors';
import { getCurrentUser } from 'store/selectors';

export interface GuessingProps {
  game: FishbowlGameState;
}

const Guessing: React.FC<GuessingProps> = ({ game }) => {
  const currentUser = useSelector(getCurrentUser());
  const isActivePlayer = currentUser?.id === game.activePlayer.userId;

  const [timeLeft, setTimeLeft] = useState(30);
  const dispatch = useDispatch();
  const currentAnswer = getCurrentAnswer(game);

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
      <div>The current game is {game.currentGameType}.</div>
      {isActivePlayer && (
        <>
          <div>clue: {currentAnswer}</div>
          <Button onClick={() => dispatch(sendMessage(fshGotAnswer()))}>
            Got it!
          </Button>
          <Button
            secondary
            onClick={() => dispatch(sendMessage(fshSkipAnswer()))}
          >
            Skip it!
          </Button>
        </>
      )}
      <div>time left: {timeLeft}s</div>
    </div>
  );
};

export default Guessing;
