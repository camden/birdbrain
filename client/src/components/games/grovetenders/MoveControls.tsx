import React, { useCallback } from 'react';
import GroveCardRow from './CardRow';
import {
  GroveCardType,
  GroveCardEffect,
  GroveGameState,
  GroveCardDirection,
} from '@server/store/games/grovetenders/types';
import { sendMessage } from 'store/websocket/actions';
import { groveDummyAction } from '@server/store/games/grovetenders/actions';
import { useDispatch } from 'react-redux';

export interface GroveMoveControlsProps {
  game: GroveGameState;
}

const GroveMoveControls: React.FC<GroveMoveControlsProps> = (props) => {
  const dispatch = useDispatch();

  const cards: GroveCardType[] = [
    {
      effect: GroveCardEffect.MOVE,
      target: GroveCardDirection.UP,
    },
    {
      effect: GroveCardEffect.MOVE,
      target: GroveCardDirection.LEFT,
    },
    {
      effect: GroveCardEffect.MOVE,
      target: GroveCardDirection.RIGHT,
    },
    {
      effect: GroveCardEffect.MOVE,
      target: GroveCardDirection.DOWN,
    },
  ];

  const onActivateCard = useCallback(
    (card: GroveCardType, cardIndex: number) => {
      if (!card.target) {
        return;
      }

      dispatch(sendMessage(groveDummyAction()));
    },
    [dispatch]
  );

  return <GroveCardRow cards={cards} onClick={onActivateCard} />;
};

export default GroveMoveControls;
