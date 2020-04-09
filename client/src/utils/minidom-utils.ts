import useSelector from 'store/use-selector';
import { getCurrentUser } from 'store/selectors';
import {
  MinidomGameState,
  MinidomPlayer,
} from '@server/store/games/minidom/types';

export const useCurrentPlayer = (game: MinidomGameState): MinidomPlayer => {
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
