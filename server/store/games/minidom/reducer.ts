import { MinidomGameState, MinidomPlayer } from './types';
import { MinidomActionTypes, DOM_DRAW_CARD } from './actions';
import { produce } from 'immer';
import { pickRandomNumber, pickElement } from '../../../utils/rng';

const getPlayer = (
  game: MinidomGameState,
  action: MinidomActionTypes
): MinidomPlayer => {
  const player = game.players.find(p => p.userId === action.meta.userId);
  if (!player) {
    throw new Error('Expected to find player for id.');
  }

  return player;
};

export const minidomReducer = (
  game: MinidomGameState,
  action: MinidomActionTypes
) => {
  switch (action.type) {
    case DOM_DRAW_CARD: {
      return produce(game, draftState => {
        const player = getPlayer(draftState, action);
        const [drawnCard, indexOfDrawnCard] = pickElement(
          player.collection.deck
        );

        if (!drawnCard) {
          return;
        }

        player.collection.deck.splice(indexOfDrawnCard, 1);
        player.collection.hand.push(drawnCard);
      });
    }
  }
};
