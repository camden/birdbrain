import React, { useCallback } from 'react';
import {
  MinidomGameState,
  MinidomCardType,
  MinidomTurnPhase,
} from '@server/store/games/minidom/types';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import {
  domPlayCardFromHand,
  domEndPhase,
} from '@server/store/games/minidom/actions';
import MinidomCardRow from './CardRow';
import { useCurrentPlayer } from 'utils/minidom-utils';
import MinidomMoveControls from './MoveControls';
import Button from 'components/shared/button/Button';

export interface MinidomMainInputProps {
  game: MinidomGameState;
}

const MinidomMainInput: React.FC<MinidomMainInputProps> = ({ game }) => {
  const dispatch = useDispatch();
  const currentPlayer = useCurrentPlayer(game);

  const onPlayCardFromHand = useCallback(
    (card: MinidomCardType, cardIndex: number) => {
      dispatch(sendMessage(domPlayCardFromHand(cardIndex)));
    },
    []
  );

  const endPhase = useCallback(() => dispatch(sendMessage(domEndPhase())), []);

  switch (game.currentTurnPhase) {
    case MinidomTurnPhase.MOVE:
      return <MinidomMoveControls game={game} />;
    case MinidomTurnPhase.PLAY:
      return (
        <>
          <h2>Card plays left: {game.cardPlaysRemaining}</h2>
          <MinidomCardRow
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
    case MinidomTurnPhase.BUY:
      return (
        <div>
          shop
          <Button secondary onClick={endPhase}>
            Done Buying
          </Button>
        </div>
      );
  }

  return <div>main</div>;
};

export default MinidomMainInput;
