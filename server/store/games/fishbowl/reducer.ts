import {
  FishbowlGameState,
  FishbowlPhase,
  FishbowlPlayer,
  FishbowlGameType,
} from './types';
import {
  FishbowlActionTypes,
  FSH_START_ROUND,
  FSH_REPORT_END_ROUND,
  FSH_GOT_ANSWER,
  FSH_SKIP_ANSWER,
  FSH_ACK_RESULTS,
} from './actions';
import produce from 'immer';
import { ROUND_DURATION_MS, POINTS_FOR_SKIPPED, POINTS_FOR_GOT } from '.';
import { getCurrentAnswer } from './selectors';
import shuffleArray from 'utils/shuffle-array';

const getScoreAddition = (game: FishbowlGameState): number => {
  const pointsForSkipped = game.answersSkipped.length * POINTS_FOR_SKIPPED;
  const pointsForGot = game.answersGot.length * POINTS_FOR_GOT;

  console.log(
    pointsForSkipped,
    pointsForGot,
    game.answersSkipped,
    game.answersGot
  );

  return pointsForSkipped + pointsForGot;
};

const getNextActivePlayer = (game: FishbowlGameState): FishbowlPlayer => {
  if (game.players.length === 1) {
    return game.activePlayer;
  }

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

const getNextGameType = (game: FishbowlGameState): FishbowlGameType => {
  const curType = game.currentGameType;
  if (curType === FishbowlGameType.TABOO) {
    return FishbowlGameType.CHARADES;
  }

  if (curType === FishbowlGameType.CHARADES) {
    return FishbowlGameType.PASSWORD;
  }

  // we shouldn't really ever get here
  return FishbowlGameType.TABOO;
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
      const isCorrectRound = game.phase === FishbowlPhase.GUESSING;
      if (!isCorrectRound) {
        return game;
      }

      return produce(game, draftState => {
        draftState.roundEndTime = null;
        draftState.phase = FishbowlPhase.RESULTS;

        draftState.score[game.activePlayer.team] += getScoreAddition(game);
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
          draftState.score[game.activePlayer.team] += getScoreAddition(game);
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
        console.log(
          'skipped',
          getCurrentAnswer(game),
          draftState.answersSkipped
        );
        draftState.indexOfCurrentAnswer++;

        if (
          draftState.indexOfCurrentAnswer >=
          game.answersForCurrentGameType.length
        ) {
          draftState.roundEndTime = null;
          draftState.phase = FishbowlPhase.RESULTS;
          draftState.score[game.activePlayer.team] += getScoreAddition(
            draftState
          );
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
          draftState.answersForCurrentGameType = game.answersForCurrentGameType.concat(
            game.answersSkipped
          );
          draftState.answersSkipped = [];

          if (
            game.indexOfCurrentAnswer >=
            draftState.answersForCurrentGameType.length
          ) {
            if (game.currentGameType === FishbowlGameType.PASSWORD) {
              draftState.phase = FishbowlPhase.END_GAME_RESULTS;
            } else {
              draftState.currentGameType = getNextGameType(game);
              draftState.indexOfCurrentAnswer = 0;
              // TODO don't use rng here...
              draftState.answersForCurrentGameType = shuffleArray([
                ...game.allAnswers,
              ]);
            }
          }
        }
      });
    }
  }
};
