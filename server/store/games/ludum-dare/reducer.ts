import produce from 'immer';
import { MINIGAME_DURATION_MS } from '.';
import {
  LD_ACK,
  LD_CHECK_MINIGAME_ANSWER,
  LD_REPORT_END_MINIGAME,
  LD_START_MINIGAME,
  LudumActionTypes,
} from './actions';
import {
  checkMinigameAnswer,
  createMinigameState,
  pickNextMinigame,
} from './minigames';
import { LudumGameState, LudumPhase, LudumPlayer } from './types';

const getPlayer = (
  game: LudumGameState,
  action: LudumActionTypes
): LudumPlayer => {
  const player = game.players.find((p) => p.userId === action.meta.userId);
  if (!player) {
    throw new Error('Expected to find player for id.');
  }

  return player;
};

const ludumReducer = (
  game: LudumGameState,
  action: LudumActionTypes
): LudumGameState => {
  switch (action.type) {
    case LD_ACK:
      return produce(game, (draftState) => {
        const player = getPlayer(draftState, action);

        if (game.acknowledged.includes(player.userId)) {
          return;
        }

        draftState.acknowledged.push(player.userId);

        const livingPlayers = game.players.filter((p) => p.health > 0);
        const everyoneAcked = livingPlayers.every((p) =>
          draftState.acknowledged.includes(p.userId)
        );

        if (everyoneAcked) {
          const onlyOnePlayerLeft =
            livingPlayers.filter((p) => p.health > 0).length === 1;
          const playingWithMoreThanOnePlayer = game.players.length > 1;
          if (
            draftState.phase === LudumPhase.MINIGAME_RESULTS &&
            onlyOnePlayerLeft &&
            playingWithMoreThanOnePlayer
          ) {
            draftState.phase = LudumPhase.GAME_OVER;
            draftState.acknowledged = [];
            return;
          }

          draftState.phase = LudumPhase.PRE_MINIGAME;
          const nextMinigame = pickNextMinigame();
          draftState.currentMinigame = nextMinigame;
          draftState.currentMinigameState = createMinigameState(
            nextMinigame,
            draftState
          );
          draftState.acknowledged = [];
          draftState.roundNumber++;
          draftState.playersWhoPassedCurrentMinigame = [];
        }
      });
    case LD_START_MINIGAME:
      return produce(game, (draftState) => {
        if (game.phase !== LudumPhase.PRE_MINIGAME) {
          return;
        }

        const player = getPlayer(draftState, action);

        if (game.acknowledged.includes(player.userId)) {
          return;
        }

        draftState.acknowledged.push(player.userId);

        const livingPlayers = game.players.filter((p) => p.health > 0);
        const everyoneAcked = livingPlayers.every((p) =>
          draftState.acknowledged.includes(p.userId)
        );

        if (everyoneAcked) {
          draftState.phase = LudumPhase.PLAY_MINIGAME;
          draftState.acknowledged = [];
          draftState.minigameEndTime =
            action.payload.startTime + MINIGAME_DURATION_MS;
        }
      });
    case LD_REPORT_END_MINIGAME:
      return produce(game, (draftState) => {
        if (game.phase !== LudumPhase.PLAY_MINIGAME) {
          return;
        }

        draftState.minigameEndTime = null;
        draftState.currentMinigame = null;
        draftState.phase = LudumPhase.MINIGAME_RESULTS;

        // @TODO this code is duplicated
        const lastMinigamePlayed = game.currentMinigame;
        if (
          !!lastMinigamePlayed &&
          !draftState.minigamesPlayedSoFar.includes(lastMinigamePlayed)
        ) {
          draftState.minigamesPlayedSoFar.push(lastMinigamePlayed);
        }

        const playersWhoFailed = draftState.players.filter(
          (p) => !game.playersWhoPassedCurrentMinigame.includes(p.userId)
        );
        playersWhoFailed.forEach(
          (player) => (player.health = Math.max(0, player.health - 1))
        );
      });
    case LD_CHECK_MINIGAME_ANSWER:
      return produce(game, (draftState) => {
        if (game.phase !== LudumPhase.PLAY_MINIGAME) {
          return;
        }

        const currentPlayer = getPlayer(draftState, action);
        if (
          game.playersWhoPassedCurrentMinigame.includes(currentPlayer.userId)
        ) {
          return;
        }

        const hasCorrectAnswer = checkMinigameAnswer(
          game,
          action.payload.answer
        );

        if (hasCorrectAnswer) {
          draftState.playersWhoPassedCurrentMinigame.push(currentPlayer.userId);
        }

        const everyonePassed = game.players
          .filter((p) => p.health > 0)
          .every((p) =>
            draftState.playersWhoPassedCurrentMinigame.includes(p.userId)
          );

        if (everyonePassed) {
          draftState.minigameEndTime = null;
          draftState.currentMinigame = null;
          draftState.phase = LudumPhase.MINIGAME_RESULTS;

          const lastMinigamePlayed = game.currentMinigame;
          if (
            !!lastMinigamePlayed &&
            !draftState.minigamesPlayedSoFar.includes(lastMinigamePlayed)
          ) {
            draftState.minigamesPlayedSoFar.push(lastMinigamePlayed);
          }
        }
      });
  }
};

export default ludumReducer;
