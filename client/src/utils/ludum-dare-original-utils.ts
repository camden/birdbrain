import { getCurrentUser } from 'store/selectors';
import useSelector from 'store/use-selector';
import {
  LudumOriginalPlayer,
  LudumOriginalGameState,
} from '@server/store/games/ludum-dare-original/types';

export const useCurrentPlayer = (
  game: LudumOriginalGameState
): LudumOriginalPlayer => {
  const currentUser = useSelector(getCurrentUser());
  if (!currentUser) {
    throw new Error('Something went wrong, expected current user to exist.');
  }
  const currentPlayer = game.players.find((p) => p.userId === currentUser.id);
  if (!currentPlayer) {
    throw new Error('Something went wrong, expected current player to exist.');
  }

  return currentPlayer;
};
