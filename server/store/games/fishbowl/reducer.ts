import {
  FishbowlGameState,
  FishbowlPhase,
  FishbowlPlayer,
  FishbowlGameType,
  FishbowlAnswer,
} from './types';
import {
  FishbowlActionTypes,
  FSH_START_ROUND,
  FSH_REPORT_END_ROUND,
  FSH_GOT_ANSWER,
  FSH_SKIP_ANSWER,
  FSH_ACK_RESULTS,
  FSH_SUBMIT_ANSWER,
} from './actions';
import produce from 'immer';
import {
  ROUND_DURATION_MS,
  POINTS_FOR_SKIPPED,
  POINTS_FOR_GOT,
  ANSWERS_PER_PLAYER,
} from '.';
import { getCurrentAnswer } from './selectors';
import shuffleArray from 'utils/shuffle-array';

const getScoreAddition = (game: FishbowlGameState): number => {
  const answersSkippedWithoutDupes = game.answersSkipped.filter(
    (item, index) => game.answersSkipped.indexOf(item) === index
  );
  const pointsForSkipped =
    answersSkippedWithoutDupes.length * POINTS_FOR_SKIPPED;
  const pointsForGot = game.answersGot.length * POINTS_FOR_GOT;

  return pointsForSkipped + pointsForGot;
};

const getNextActivePlayer = (game: FishbowlGameState): FishbowlPlayer => {
  if (game.nextRoundDuration !== ROUND_DURATION_MS) {
    // If the last round ended prematurely, give the active player another shot
    return game.activePlayer;
  }

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
    case FSH_SUBMIT_ANSWER: {
      const userId = action.meta.userId;
      const answersSoFar = game.answersSubmitted[userId];
      if (!answersSoFar) {
        console.error(`User with id ${userId} submitted incorrectly.`);
        return game;
      }

      if (answersSoFar.length >= ANSWERS_PER_PLAYER) {
        return game;
      }

      return produce(game, draftState => {
        draftState.answersSubmitted[userId].push(action.payload.answer);

        const allUsersSubmitted = game.players.every(
          player =>
            draftState.answersSubmitted[player.userId].length ===
            ANSWERS_PER_PLAYER
        );

        if (allUsersSubmitted) {
          draftState.phase = FishbowlPhase.PRE_ROUND;
          let allAnswers: FishbowlAnswer[] = [];
          game.players.forEach(player => {
            allAnswers = allAnswers.concat(
              draftState.answersSubmitted[player.userId]
            );
          });
          draftState.allAnswers = allAnswers;
          draftState.answersForCurrentGameType = shuffleArray([...allAnswers]);
        }
      });
    }
    case FSH_START_ROUND: {
      const isCorrectRound = game.phase === FishbowlPhase.PRE_ROUND;
      const isFromActivePlayer =
        action.meta.userId === game.activePlayer.userId;

      if (!isCorrectRound || !isFromActivePlayer) {
        return game;
      }

      return produce(game, draftState => {
        draftState.roundEndTime =
          action.payload.startTime + game.nextRoundDuration;
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

        draftState.nextRoundDuration = ROUND_DURATION_MS;
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
        draftState.answersForCurrentGameType = game.answersForCurrentGameType.filter(
          answer => answer !== getCurrentAnswer(game)
        );

        if (draftState.answersForCurrentGameType.length === 0) {
          if (!game.roundEndTime) {
            throw new Error('Expected roundEndTime to exist.');
          }
          const timeLeftInRoundMs = game.roundEndTime - action.meta.timestamp;
          draftState.nextRoundDuration = timeLeftInRoundMs;
          draftState.roundEndTime = null;
          draftState.phase = FishbowlPhase.RESULTS;
          draftState.score[game.activePlayer.team] += getScoreAddition(
            draftState
          );
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
        const currentAnswer = getCurrentAnswer(game);
        draftState.answersSkipped.push(currentAnswer);

        draftState.answersForCurrentGameType = draftState.answersForCurrentGameType.filter(
          a => a !== currentAnswer
        );
        draftState.answersForCurrentGameType.push(currentAnswer);
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
          draftState.answersForCurrentGameType = shuffleArray([
            ...game.answersForCurrentGameType,
          ]);
          draftState.answersSkipped = [];

          if (draftState.answersForCurrentGameType.length === 0) {
            if (game.currentGameType === FishbowlGameType.PASSWORD) {
              draftState.phase = FishbowlPhase.END_GAME_RESULTS;
            } else {
              draftState.currentGameType = getNextGameType(game);
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
