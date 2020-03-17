import React, { useState } from 'react';
import { FishbowlGameState } from '@server/store/games/fishbowl/types';
import { Room } from '@server/store/general/types';
import styles from './FishbowlMain.module.css';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { fshStartRound } from '@server/store/games/fishbowl/actions';
import useSelector from 'store/use-selector';
import { getGame } from 'store/selectors';
import { getRoundEndTime } from '@server/store/games/fishbowl/selectors';
import { differenceInSeconds } from 'date-fns';
import useInterval from 'use-interval';

export interface FishbowlProps {
  game: FishbowlGameState;
  room: Room;
}

const FishbowlMain: React.FC<FishbowlProps> = props => {
  const dispatch = useDispatch();
  const game = useSelector(getGame()) as FishbowlGameState;
  const [timeLeftInSeconds, setTimeLeftInSeconds] = useState<number | null>(
    null
  );

  useInterval(() => {
    const endTime = getRoundEndTime()(game);

    if (endTime) {
      const timeLeft = differenceInSeconds(endTime, Date.now());
      setTimeLeftInSeconds(timeLeft);
    }
  }, 1000);

  if (!game) {
    return null;
  }

  let timeLeftMessage: string | number = 'n/a';
  if (timeLeftInSeconds) {
    timeLeftMessage = timeLeftInSeconds;
  }

  return (
    <div className={styles.wrapper}>
      Fishbowl game!
      <Button onClick={() => dispatch(sendMessage(fshStartRound(Date.now())))}>
        Start round
      </Button>
      <div>time left: {timeLeftMessage}</div>
    </div>
  );
};

export default FishbowlMain;
