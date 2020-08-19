import {
  GeneralState,
  GeneralActionTypes,
  ADD_USER_TO_ROOM,
  REMOVE_USER_FROM_ROOM,
  RoomID,
  Room,
  CREATE_NEW_ROOM,
  GameActionTypes,
  END_CURRENT_GAME,
} from './types';
import { produce } from 'immer';
import { START_GAME_MESSAGE, PICK_GAME_TYPE_MESSAGE } from '../client/types';
import { pickRandomNumber } from 'utils/rng';
import { GameType, Game } from '../games/types';
import { createNewGame } from '../games';
import { resistanceReducer } from '../games/the-resistance/reducers';
import { ResistanceGameState } from '../games/the-resistance/types';
import { ResistanceActionTypes } from '../games/the-resistance/actions';
import { FishbowlActionTypes } from '../games/fishbowl/actions';
import { ChatActionTypes } from 'store/games/chat/actions';
import { chatReducer } from 'store/games/chat/reducers';
import { fishbowlReducer } from 'store/games/fishbowl/reducer';
import { ChatGameState } from 'store/games/chat/types';
import { FishbowlGameState } from 'store/games/fishbowl/types';
import { MinidomGameState } from 'store/games/minidom/types';
import { MinidomActionTypes } from 'store/games/minidom/actions';
import { minidomReducer } from 'store/games/minidom/reducer';
import { PongGameState } from 'store/games/pong/types';
import { PongActionTypes } from 'store/games/pong/actions';
import { pongReducer } from 'store/games/pong/reducer';
import { LudumGameState } from 'store/games/ludum-dare/types';
import { LudumActionTypes } from 'store/games/ludum-dare/actions';
import ludumReducer from 'store/games/ludum-dare/reducer';
import { LudumOriginalGameState } from 'store/games/ludum-dare-original/types';
import { LudumOriginalActionTypes } from 'store/games/ludum-dare-original/actions';
import ludumOriginalReducer from 'store/games/ludum-dare-original/reducer';
import { SpeedboatGameState } from 'store/games/speedboat/types';
import speedboatReducer, {
  SpeedboatActionTypes,
} from 'store/games/speedboat/reducer';
import scoreCounterReducer, {
  ScoreCounterActionTypes,
} from 'store/games/score-counter/reducer';
import { ScoreCounterGameState } from 'store/games/score-counter/types';

const initialState: GeneralState = {
  entities: {
    rooms: {
      byId: {
        DEBUG: {
          id: 'DEBUG',
          users: [],
          leaderUserID: null,
          game: null,
          selectedGameType: GameType.SCORE_COUNTER,
        },
      },
      allIds: ['DEBUG'],
    },
    users: {
      byId: {},
      allIds: [],
    },
    games: {
      byId: {},
      allIds: [],
    },
  },
};

const getRoomById = (roomId: RoomID, state: GeneralState): Room | null => {
  return state.entities.rooms.byId[roomId] || null;
};

function customGameReducer<
  ActionTypes extends GameActionTypes,
  GameState extends Game
>(
  gameReducer: (game: GameState, action: ActionTypes) => GameState,
  state: GeneralState,
  action: GeneralActionTypes
) {
  const gameAction = action as ActionTypes;
  const roomId = gameAction.meta?.roomId;
  if (!roomId) {
    return state;
  }

  const room = getRoomById(roomId, state);
  const gameId = room?.game;
  if (!gameId) {
    return state;
  }
  return produce(state, (draftState) => {
    const game = draftState.entities.games.byId[gameId];
    if (!game) {
      return;
    }

    const updatedGame = gameReducer(game as GameState, gameAction);

    draftState.entities.games.byId[gameId] = updatedGame;
  });
}

export const generalReducer = (
  state = initialState,
  action: GeneralActionTypes
) => {
  if (action.type.startsWith('SC_')) {
    return customGameReducer<ScoreCounterActionTypes, ScoreCounterGameState>(
      scoreCounterReducer,
      state,
      action
    );
  }

  if (action.type.startsWith('SB_')) {
    return customGameReducer<SpeedboatActionTypes, SpeedboatGameState>(
      speedboatReducer,
      state,
      action
    );
  }

  if (
    action.type.startsWith('LD_') &&
    !action.type.startsWith('LD_ORIGINAL_')
  ) {
    return customGameReducer<LudumActionTypes, LudumGameState>(
      ludumReducer,
      state,
      action
    );
  }

  if (action.type.startsWith('LD_ORIGINAL_')) {
    return customGameReducer<LudumOriginalActionTypes, LudumOriginalGameState>(
      ludumOriginalReducer,
      state,
      action
    );
  }

  if (action.type.startsWith('PONG_')) {
    return customGameReducer<PongActionTypes, PongGameState>(
      pongReducer,
      state,
      action
    );
  }

  if (action.type.startsWith('DOM_')) {
    return customGameReducer<MinidomActionTypes, MinidomGameState>(
      minidomReducer,
      state,
      action
    );
  }

  if (action.type.startsWith('FSH_')) {
    return customGameReducer<FishbowlActionTypes, FishbowlGameState>(
      fishbowlReducer,
      state,
      action
    );
  }

  if (action.type.startsWith('CHAT_')) {
    return customGameReducer<ChatActionTypes, ChatGameState>(
      chatReducer,
      state,
      action
    );
  }

  if (action.type.startsWith('RST_')) {
    return customGameReducer<ResistanceActionTypes, ResistanceGameState>(
      resistanceReducer,
      state,
      action
    );
  }

  switch (action.type) {
    case PICK_GAME_TYPE_MESSAGE: {
      const roomId = action.meta.roomId;

      if (!roomId) {
        return state;
      }

      return produce(state, (draftState) => {
        const room = draftState.entities.rooms.byId[roomId];
        room.selectedGameType = action.payload.gameType;
      });
    }
    case START_GAME_MESSAGE: {
      const roomId = action.meta.roomId;

      if (!roomId) {
        return state;
      }

      const room = state.entities.rooms.byId[roomId];

      if (!room.selectedGameType) {
        return state;
      }

      const usersInRoom = room.users.map(
        (userId) => state.entities.users.byId[userId]
      );
      const newGame = createNewGame(room.selectedGameType, usersInRoom);

      return produce(state, (draftState) => {
        const room = draftState.entities.rooms.byId[roomId];

        room.game = newGame.id;

        draftState.entities.games.allIds.push(newGame.id);
        draftState.entities.games.byId[newGame.id] = newGame;
      });
    }
    case CREATE_NEW_ROOM:
      return produce(state, (draftState) => {
        const newRoomId = action.payload.roomId;
        draftState.entities.rooms.allIds.push(newRoomId);

        draftState.entities.rooms.byId[newRoomId] = {
          id: newRoomId,
          game: null,
          leaderUserID: null,
          users: [],
          selectedGameType: null,
        };
      });
    case ADD_USER_TO_ROOM:
      return produce(state, (draftState) => {
        const room = draftState.entities.rooms.byId[action.payload.room.id];
        const newUser = action.payload.user;

        if (!room) {
          return;
        }

        const roomLeaderIsNotInRoom = room.users.every(
          (userId) => room.leaderUserID !== userId
        );

        if (room.users.length === 0 || roomLeaderIsNotInRoom) {
          room.leaderUserID = newUser.id;
        }

        room.users.push(newUser.id);
        draftState.entities.users.allIds.push(newUser.id);
        draftState.entities.users.byId[newUser.id] = newUser;
      });
    case REMOVE_USER_FROM_ROOM:
      return produce(state, (draftState) => {
        const room = draftState.entities.rooms.byId[action.payload.room.id];
        const userToRemove = action.payload.user;

        if (!room) {
          return;
        }

        room.users = room.users.filter((id) => id !== userToRemove.id);

        draftState.entities.users.allIds = draftState.entities.users.allIds.filter(
          (id) => id !== userToRemove.id
        );

        delete draftState.entities.users.byId[userToRemove.id];

        // if user was leader, set a different user as the leader
        if (room.users.length > 0 && room.leaderUserID === userToRemove.id) {
          room.leaderUserID =
            room.users[pickRandomNumber(0, room.users.length)];
        }

        // if room is now empty, delete room (except when developing)
        if (room.users.length === 0 && process.env.NODE_ENV === 'production') {
          draftState.entities.rooms.allIds = draftState.entities.rooms.allIds.filter(
            (id) => id !== room.id
          );
          delete draftState.entities.rooms.byId[room.id];
        }
      });
    case END_CURRENT_GAME: {
      return produce(state, (draftState) => {
        const room = draftState.entities.rooms.byId[action.meta.roomId];
        if (!room) {
          throw new Error(
            `Expected room with id ${action.meta.roomId} to exist, but it doesn't.`
          );
        }

        const gameId = room.game;

        if (!gameId) {
          return;
        }

        // delete game
        draftState.entities.games.allIds = draftState.entities.games.allIds.filter(
          (id) => id !== gameId
        );
        delete draftState.entities.games.byId[gameId];

        // remove current game from room
        room.game = null;
      });
    }
    default:
      return state;
  }
};
