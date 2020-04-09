import {
  MinidomGameState,
  MinidomPlayer,
  MinidomCardType,
  MinidomCardEffect,
  MinidomCardDirection,
} from './types';
import {
  MinidomActionTypes,
  DOM_DRAW_CARD,
  DOM_PLAY_CARD_FROM_HAND,
  DOM_ACTIVATE_CARD,
} from './actions';
import { produce } from 'immer';
import { pickElement } from '../../../utils/rng';
import { UserID } from 'store/general/types';
import { log } from 'utils/log';

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

  log(`${sender.name} played ${card.effect}`);

  switch (card.effect) {
    case MinidomCardEffect.MOVE: {
      if (!card.target) {
        return;
      }

      switch (card.target) {
        case MinidomCardDirection.UP:
          sender.location.y = (sender.location.y - 1 + 3) % 3;
          break;
        case MinidomCardDirection.DOWN:
          sender.location.y = (sender.location.y + 1 + 3) % 3;
          break;
        case MinidomCardDirection.LEFT:
          sender.location.x = (sender.location.x - 1 + 3) % 3;
          break;
        case MinidomCardDirection.RIGHT:
          sender.location.x = (sender.location.x + 1 + 3) % 3;
          break;
      }
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
    case DOM_ACTIVATE_CARD: {
      return produce(game, (draftState) => {
        const player = getPlayer(draftState, action);
        const card = action.payload.card;

        if (!card) {
          console.error('Player tried to play invalid card.');
          return;
        }

        // play the card
        applyCardEffect(draftState, card, player.userId);
      });
    }
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
        applyCardEffect(draftState, card, player.userId);

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
    default:
      return game;
  }
};
