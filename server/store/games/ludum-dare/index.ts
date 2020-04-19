import {
  LudumGameState,
  LudumPlayer,
  LudumPhase,
  LudumCharacter,
} from './types';
import { GameType, GameID } from '../types';
import { User } from 'store/general/types';
import characters from './characters';
import shuffleArray from '../../../utils/shuffle-array';

export const DEBUG_DURATION = 3050000;
export const DEFAULT_DURATION = 30500;

export const MINIGAME_DURATION_MS =
  process.env.NODE_ENV === 'production' ? DEFAULT_DURATION : DEBUG_DURATION;

const createPlayerFromUser = (
  user: User,
  character: LudumCharacter
): LudumPlayer => {
  return {
    userId: user.id,
    name: user.name,
    character,
  };
};

export const createNewGameOfLudum = (
  id: GameID,
  usersInRoom: User[]
): LudumGameState => {
  let availableCharacters = shuffleArray([...characters]);
  const characterPool: LudumCharacter[] = [];
  for (let i = 0; i < usersInRoom.length; i++) {
    if (availableCharacters.length === 0) {
      availableCharacters = shuffleArray([...characters]);
    }

    characterPool.push(availableCharacters.pop() as LudumCharacter);
  }

  const players = usersInRoom.map((user, index) =>
    createPlayerFromUser(user, characterPool[index])
  );

  return {
    id,
    type: GameType.LUDUM,
    players,
    acknowledged: [],
    phase: LudumPhase.INTRO,
    minigameEndTime: null,
    currentMinigame: null,
    currentMinigameState: null,
    playersWhoPassedCurrentMinigame: [],
    roundNumber: 0,
  };
};
