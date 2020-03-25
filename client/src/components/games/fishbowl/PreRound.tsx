import React, { useCallback } from 'react';
import { FishbowlGameState } from '@server/store/games/fishbowl/types';
import useSelector from 'store/use-selector';
import { getCurrentUser } from 'store/selectors';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { fshStartRound } from '@server/store/games/fishbowl/actions';
import { sendMessage } from 'store/websocket/actions';

export interface PreRoundProps {
  game: FishbowlGameState;
}

const PreRound: React.FC<PreRoundProps> = ({ game }) => {
  const currentUser = useSelector(getCurrentUser());
  const dispatch = useDispatch();

  const onStartRoundClick = useCallback(() => {
    dispatch(sendMessage(fshStartRound(Date.now())));
  }, [dispatch]);

  const isActivePlayer = currentUser?.id === game.activePlayer.userId;

  return (
    <div>
      <h2>{game.activePlayer.name} is up.</h2>
      <div>The current game is {game.currentGameType}.</div>
      {isActivePlayer && (
        <Button onClick={onStartRoundClick}>Start round</Button>
      )}
    </div>
  );
};

export default PreRound;
