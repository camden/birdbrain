import useSelector from 'store/use-selector';
import { getCurrentUser } from 'store/selectors';
import { PongGameState, PongPlayer } from '@server/store/games/pong/types';

export const useCurrentPlayer = (game: PongGameState): PongPlayer => {
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
