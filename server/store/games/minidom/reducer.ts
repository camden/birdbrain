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
  DOM_END_PHASE,
} from './actions';
import { produce, setUseProxies } from 'immer';
import { pickElement } from '../../../utils/rng';
import { UserID } from 'store/general/types';
import { log } from 'utils/log';
import shuffleArray from 'utils/shuffle-array';

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

const isNotActivePlayer = (
  game: MinidomGameState,
  player: MinidomPlayer
): boolean => {
  return player.userId !== game.players[game.activePlayerIndex].userId;
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
  const lastActivePlayer = game.players[game.activePlayerIndex];
  // game.activePlayerIndex = (game.activePlayerIndex + 1) % game.players.length;
  game.currentTurnPhase = MinidomTurnPhase.MOVE;
  game.cardPlaysRemaining = 1;

  const deck = lastActivePlayer.collection.deck;
  const discardPile = lastActivePlayer.collection.discardPile;
  const hand = lastActivePlayer.collection.hand;

  // discard cards in hand
  lastActivePlayer.collection.discardPile = discardPile.concat(hand);

  // deal new cards
  if (deck.length === 0) {
    lastActivePlayer.collection.deck = shuffleArray([
      ...lastActivePlayer.collection.discardPile,
    ]);
  } else {
    const topCardOfDeck = { ...deck.pop() } as MinidomCardType;
    lastActivePlayer.collection.hand.push(topCardOfDeck);
  }
};

export const minidomReducer = (
  game: MinidomGameState,
  action: MinidomActionTypes
) => {
  switch (action.type) {
    case DOM_END_PHASE: {
      return produce(game, (draftState) => {
        const player = getPlayer(draftState, action);
        if (isNotActivePlayer(game, player)) {
          return;
        }

        if (game.currentTurnPhase === MinidomTurnPhase.PLAY) {
          draftState.currentTurnPhase = MinidomTurnPhase.BUY;
          return;
        } else if (game.currentTurnPhase === MinidomTurnPhase.BUY) {
          endCurrentTurn(draftState);
        }
      });
    }
    case DOM_MAKE_MOVE: {
      return produce(game, (draftState) => {
        const player = getPlayer(draftState, action);
        const isNotActivePlayer =
          player.userId !== game.players[game.activePlayerIndex].userId;
        if (isNotActivePlayer) {
          return;
        }

        if (game.currentTurnPhase !== MinidomTurnPhase.MOVE) {
          return;
        }

        const direction = action.payload.direction;

        const moveCard: MinidomCardType = {
          effect: MinidomCardEffect.MOVE,
          target: direction,
        };

        applyCardEffect(draftState, moveCard, player.userId);

        draftState.currentTurnPhase = MinidomTurnPhase.PLAY;
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
        if (isNotActivePlayer(game, player)) {
          return;
        }

        const idx = action.payload.cardIndex;

        const card = player.collection.hand[idx];

        if (!card) {
          console.error('Player tried to play invalid card index.');
          return;
        }

        if (game.cardPlaysRemaining === 0) {
          return;
        }

        // play the card
        applyCardEffect(draftState, card, player.userId);

        // remove the card from your hand and put into discard
        player.collection.hand.splice(idx, 1);
        player.collection.discardPile.push(card);

        // reduce card plays by 1
        draftState.cardPlaysRemaining -= 1;
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
