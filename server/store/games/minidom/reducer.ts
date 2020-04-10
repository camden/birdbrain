import {
  MinidomGameState,
  MinidomPlayer,
  MinidomCardType,
  MinidomCardEffect,
  MinidomCardDirection,
  MinidomPlayerLocation,
  MinidomTurnPhase,
} from './types';
import {
  MinidomActionTypes,
  DOM_DRAW_CARD,
  DOM_PLAY_CARD_FROM_HAND,
  DOM_ACTIVATE_CARD,
  DOM_MAKE_MOVE,
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

const getNextLocation = (
  curLocation: MinidomPlayerLocation,
  game: MinidomGameState,
  direction: MinidomCardDirection
): { x: number; y: number } => {
  switch (direction) {
    case MinidomCardDirection.UP:
      return {
        ...curLocation,
        y: (curLocation.y - 1 + 3) % 3,
      };
    case MinidomCardDirection.DOWN:
      return {
        ...curLocation,
        y: (curLocation.y + 1 + 3) % 3,
      };
    case MinidomCardDirection.LEFT:
      return {
        ...curLocation,
        x: (curLocation.x - 1 + 3) % 3,
      };
    case MinidomCardDirection.RIGHT:
      return {
        ...curLocation,
        x: (curLocation.x + 1 + 3) % 3,
      };
  }
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

      sender.previousLocation = sender.location;
      sender.location = getNextLocation(sender.location, game, card.target);
    }
    default:
      return;
  }
};

/**
 * ends the current turn. mutates!
 * @param game
 */
const endCurrentTurn = (game: MinidomGameState) => {
  game.activePlayerIndex = (game.activePlayerIndex + 1) % game.players.length;
  game.currentTurnPhase = MinidomTurnPhase.MOVE;
};

export const minidomReducer = (
  game: MinidomGameState,
  action: MinidomActionTypes
) => {
  switch (action.type) {
    case DOM_MAKE_MOVE: {
      return produce(game, (draftState) => {
        const player = getPlayer(draftState, action);
        const isNotActivePlayer =
          player.userId !== game.players[game.activePlayerIndex].userId;
        if (isNotActivePlayer) {
          return;
        }

        const direction = action.payload.direction;

        const moveCard: MinidomCardType = {
          effect: MinidomCardEffect.MOVE,
          target: direction,
        };

        applyCardEffect(draftState, moveCard, player.userId);
        endCurrentTurn(draftState);
      });
    }
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
