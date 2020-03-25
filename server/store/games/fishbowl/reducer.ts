import { FishbowlGameState, FishbowlPhase, FishbowlPlayer } from './types';
import {
  FishbowlActionTypes,
  FSH_START_ROUND,
  FSH_REPORT_END_ROUND,
  FSH_GOT_ANSWER,
  FSH_SKIP_ANSWER,
  FSH_ACK_RESULTS,
} from './actions';
import produce from 'immer';
import { ROUND_DURATION_MS } from '.';

const getNextActivePlayer = (game: FishbowlGameState): FishbowlPlayer => {
  return game.activePlayer;
};

export const fishbowlReducer = (
  game: FishbowlGameState,
  action: FishbowlActionTypes
): FishbowlGameState => {
  switch (action.type) {
    case FSH_START_ROUND: {
      const isCorrectRound = game.phase === FishbowlPhase.PRE_ROUND;
      const isFromActivePlayer =
        action.meta.userId === game.activePlayer.userId;

      if (!isCorrectRound || !isFromActivePlayer) {
        return game;
      }

      return produce(game, draftState => {
        draftState.roundEndTime = action.payload.startTime + ROUND_DURATION_MS;
        draftState.currentAnswer = action.payload.nextAnswer;
        draftState.phase = FishbowlPhase.GUESSING;
      });
    }
    case FSH_REPORT_END_ROUND: {
      return produce(game, draftState => {
        draftState.roundEndTime = null;
        draftState.phase = FishbowlPhase.RESULTS;
        draftState.currentAnswer = null;
      });
    }
    case FSH_GOT_ANSWER: {
      const isCorrectRound = game.phase === FishbowlPhase.GUESSING;
      const isFromActivePlayer =
        action.meta.userId === game.activePlayer.userId;

      if (!isCorrectRound || !isFromActivePlayer) {
        return game;
      }

      return produce(game, draftState => {
        if (!game.currentAnswer) {
          return;
        }

        draftState.answersAlreadySeen.push(game.currentAnswer);
        draftState.answersGot.push(game.currentAnswer);

        draftState.currentAnswer = action.payload.nextAnswer;
      });
    }
    case FSH_SKIP_ANSWER: {
      const isCorrectRound = game.phase === FishbowlPhase.GUESSING;
      const isFromActivePlayer =
        action.meta.userId === game.activePlayer.userId;

      if (!isCorrectRound || !isFromActivePlayer) {
        return game;
      }

      return produce(game, draftState => {
        if (!game.currentAnswer) {
          return;
        }

        draftState.answersAlreadySeen.push(game.currentAnswer);
        draftState.answersSkipped.push(game.currentAnswer);

        draftState.currentAnswer = action.payload.nextAnswer;
      });
    }
    case FSH_ACK_RESULTS: {
      return produce(game, draftState => {
        const userId = action.meta.userId;
        if (game.acknowledged.includes(userId)) {
          return;
        }

        draftState.acknowledged.push(userId);

        const allUsersAcked = game.players.every(p =>
          draftState.acknowledged.includes(p.userId)
        );
        if (allUsersAcked) {
          draftState.acknowledged = [];
          draftState.phase = FishbowlPhase.PRE_ROUND;
          draftState.activePlayer = getNextActivePlayer(game);
          draftState.answersGot = [];
          draftState.answersSkipped = [];
        }
      });
    }
  }
};
