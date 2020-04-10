import React, { useCallback } from 'react';
import MinidomCardRow from './CardRow';
import {
  MinidomCardType,
  MinidomCardEffect,
  MinidomGameState,
  MinidomCardDirection,
} from '@server/store/games/minidom/types';
import { sendMessage } from 'store/websocket/actions';
import {
  domPlayCardFromHand,
  domActivateCard,
  domMakeMove,
} from '@server/store/games/minidom/actions';
import { useDispatch } from 'react-redux';

export interface MinidomMoveControlsProps {
  game: MinidomGameState;
}

const MinidomMoveControls: React.FC<MinidomMoveControlsProps> = (props) => {
  const dispatch = useDispatch();

  const cards: MinidomCardType[] = [
    {
      effect: MinidomCardEffect.MOVE,
      target: MinidomCardDirection.UP,
    },
    {
      effect: MinidomCardEffect.MOVE,
      target: MinidomCardDirection.LEFT,
    },
    {
      effect: MinidomCardEffect.MOVE,
      target: MinidomCardDirection.RIGHT,
    },
    {
      effect: MinidomCardEffect.MOVE,
      target: MinidomCardDirection.DOWN,
    },
  ];

  const onActivateCard = useCallback(
    (card: MinidomCardType, cardIndex: number) => {
      if (!card.target) {
        return;
      }

      dispatch(sendMessage(domMakeMove(card.target)));
    },
    []
  );

  return <MinidomCardRow cards={cards} onClick={onActivateCard} />;
};

export default MinidomMoveControls;
