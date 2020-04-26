import {
  LudumOriginalGameState,
  LudumOriginalPlayer,
  LudumOriginalPhase,
  LudumOriginalCharacter,
} from './types';
import { GameType, GameID } from '../types';
import { User } from 'store/general/types';
import characters from './characters';
import shuffleArray from '../../../utils/shuffle-array';

export const DEBUG_DURATION = 25500;
export const DEFAULT_DURATION = 25500;

export const MINIGAME_DURATION_MS =
  process.env.NODE_ENV === 'production' ? DEFAULT_DURATION : DEBUG_DURATION;

const createPlayerFromUser = (
  user: User,
  character: LudumOriginalCharacter
): LudumOriginalPlayer => {
  return {
    userId: user.id,
    name: user.name,
    character,
    health: 3,
  };
};

export const createNewGameOfLudumOriginal = (
  id: GameID,
  usersInRoom: User[]
): LudumOriginalGameState => {
  let availableCharacters = shuffleArray([...characters]);
  const characterPool: LudumOriginalCharacter[] = [];
  for (let i = 0; i < usersInRoom.length; i++) {
    if (availableCharacters.length === 0) {
      availableCharacters = shuffleArray([...characters]);
    }

    characterPool.push(availableCharacters.pop() as LudumOriginalCharacter);
  }

  const players = usersInRoom.map((user, index) =>
    createPlayerFromUser(user, characterPool[index])
  );

  return {
    id,
    type: GameType.LUDUM_ORIGINAL,
    players,
    acknowledged: [],
    phase: LudumOriginalPhase.INTRO,
    minigameEndTime: null,
    currentMinigame: null,
    currentMinigameState: null,
    playersWhoPassedCurrentMinigame: [],
    roundNumber: 0,
    minigamesPlayedSoFar: [],
  };
};
