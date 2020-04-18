import {
  LudumGameState,
  LudumPlayer,
} from '@server/store/games/ludum-dare/types';
import { getCurrentUser } from 'store/selectors';
import useSelector from 'store/use-selector';

export const useCurrentPlayer = (game: LudumGameState): LudumPlayer => {
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
