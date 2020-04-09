import {
  MinidomGameState,
  MinidomPlayer,
  MinidomCardType,
  MinidomCardEffect,
} from './types';
import {
  MinidomActionTypes,
  DOM_DRAW_CARD,
  DOM_PLAY_CARD_FROM_HAND,
} from './actions';
import { produce } from 'immer';
import { pickRandomNumber, pickElement } from '../../../utils/rng';
import { UserID } from 'store/general/types';

const getPlayer = (
  game: MinidomGameState,
  action: MinidomActionTypes
): MinidomPlayer => {
  const player = game.players.find((p) => p.userId === action.meta.userId);
  if (!player) {
    throw new Error('Expected to find player for id.');
  }

  return player;
};

/**
 * Applies the given card effect to the passed-in game. Mutates!
 * @param game
 * @param card
 */
const applyCardEffect = (
  game: MinidomGameState,
  card: MinidomCardType,
  senderId: UserID
): void => {
  const sender = game.players.find((p) => p.userId === senderId);
  if (!sender) {
    console.error('invalid senderId.');
    return;
  }

  switch (card.effect) {
    case MinidomCardEffect.MOVE: {
      sender.location.x += 1;
    }
    default:
      return;
  }
};

export const minidomReducer = (
  game: MinidomGameState,
  action: MinidomActionTypes
) => {
  switch (action.type) {
    case DOM_PLAY_CARD_FROM_HAND: {
      return produce(game, (draftState) => {
        const player = getPlayer(draftState, action);
        const idx = action.payload.cardIndex;

        const card = player.collection.hand[idx];

        if (!card) {
          console.error('Player tried to play invalid card index.');
          return;
        }

        // play the card
        draftState = applyCardEffect(draftState, card, player.userId);

        // remove the card from your hand
        player.collection.hand.splice(idx, 1);
      });
    }

    case DOM_DRAW_CARD: {
      return produce(game, (draftState) => {
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
