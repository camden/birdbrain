import React, { useCallback } from 'react';
import {
  GroveGameState,
  GroveCardType,
  GroveTurnPhase,
} from '@server/store/games/grovetenders/types';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { groveDummyAction } from '@server/store/games/grovetenders/actions';
import GroveCardRow from './CardRow';
import { useCurrentPlayer } from 'utils/grovetenders-utils';
import GroveMoveControls from './MoveControls';
import Button from 'components/shared/button/Button';

export interface GroveMainInputProps {
  game: GroveGameState;
}

const GroveMainInput: React.FC<GroveMainInputProps> = ({ game }) => {
  const dispatch = useDispatch();
  const currentPlayer = useCurrentPlayer(game);

  const onPlayCardFromHand = useCallback(
    (card: GroveCardType, cardIndex: number) => {
      dispatch(sendMessage(groveDummyAction()));
    },
    [dispatch]
  );

  const endPhase = useCallback(
    () => dispatch(sendMessage(groveDummyAction())),
    [dispatch]
  );

  switch (game.currentTurnPhase) {
    case GroveTurnPhase.MOVE:
      return <GroveMoveControls game={game} />;
    case GroveTurnPhase.PLAY:
      return (
        <>
          <h2>Card plays left: {game.cardPlaysRemaining}</h2>
          <GroveCardRow
            cards={currentPlayer.collection.hand}
            onClick={
              game.cardPlaysRemaining > 0 ? onPlayCardFromHand : undefined
            }
          />
          <Button secondary onClick={endPhase}>
            Done Playing Cards
          </Button>
        </>
      );
    case GroveTurnPhase.BUY:
      return (
        <div>
          <GroveCardRow cards={game.shop} />
          <Button secondary onClick={endPhase}>
            Done Buying
          </Button>
        </div>
      );
  }

  return <div>main</div>;
};

export default GroveMainInput;
