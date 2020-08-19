import { ScoreCounterPlayer, ScoreCounterGameState } from './types';
import { GameType, GameID } from '../types';
import { User } from 'store/general/types';

const createPlayerFromUser = (user: User): ScoreCounterPlayer => {
  return {
    userId: user.id,
    name: user.name,
    currentCount: 0,
  };
};

export const createNewGameOfScoreCounter = (
  id: GameID,
  usersInRoom: User[]
): ScoreCounterGameState => {
  const players = usersInRoom.map(createPlayerFromUser);

  return {
    id,
    type: GameType.SCORE_COUNTER,
    players,
  };
};
