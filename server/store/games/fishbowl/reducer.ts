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
import { getCurrentAnswer } from './selectors';

const getNextActivePlayer = (game: FishbowlGameState): FishbowlPlayer => {
  const lastActivePlayer = game.lastActivePlayer;
  const activePlayer = game.activePlayer;

  if (!lastActivePlayer) {
    // return first player on opposite team of current player
    const oppositeTeamPlayers = game.players.filter(
      p => p.team !== activePlayer.team
    );
    return oppositeTeamPlayers[0];
  } else {
    // return next player on opposite team of current player
    // based on the index of the last active player
    const oppositeTeamPlayers = game.players.filter(
      p => p.team !== activePlayer.team
    );
    const indexOfLastActivePlayer = oppositeTeamPlayers.findIndex(
      player => player.userId === lastActivePlayer.userId
    );
    const indexOfNextActivePlayer =
      (indexOfLastActivePlayer + 1) % oppositeTeamPlayers.length;
    return oppositeTeamPlayers[indexOfNextActivePlayer];
  }
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
        draftState.phase = FishbowlPhase.GUESSING;
      });
    }
    case FSH_REPORT_END_ROUND: {
      return produce(game, draftState => {
        draftState.roundEndTime = null;
        draftState.phase = FishbowlPhase.RESULTS;
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
        draftState.answersGot.push(getCurrentAnswer(game));
        draftState.indexOfCurrentAnswer++;

        if (
          draftState.indexOfCurrentAnswer >=
          game.answersForCurrentGameType.length
        ) {
          draftState.roundEndTime = null;
          draftState.phase = FishbowlPhase.RESULTS;
        }
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
        draftState.answersSkipped.push(getCurrentAnswer(game));
        draftState.indexOfCurrentAnswer++;

        if (
          draftState.indexOfCurrentAnswer >=
          game.answersForCurrentGameType.length
        ) {
          draftState.roundEndTime = null;
          draftState.phase = FishbowlPhase.RESULTS;
        }
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
          draftState.lastActivePlayer = game.activePlayer;
          draftState.activePlayer = getNextActivePlayer(game);
          draftState.answersGot = [];
          draftState.answersSkipped = [];
        }
      });
    }
  }
};
