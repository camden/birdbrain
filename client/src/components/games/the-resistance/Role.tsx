import React from 'react';
import {
  ResistanceGameState,
  ResistanceRole,
} from '@server/store/games/the-resistance/types';
import useSelector from 'store/use-selector';
import { getCurrentUser } from 'store/selectors';

export interface ResistanceProps {
  game: ResistanceGameState;
}

const TheResistanceRole: React.FC<ResistanceProps> = ({ game }) => {
  const currentUser = useSelector(getCurrentUser());
  const currentPlayer = game.players.find(
    player => player.userId === currentUser?.id
  );

  if (!currentPlayer) return null;

  const otherSpies = game.players
    .filter(player => player.role === ResistanceRole.Spy)
    .filter(player => player.userId !== currentUser?.id);

  if (currentPlayer.role === ResistanceRole.Spy) {
    return (
      <div>
        <h2>You are on the Spy Team</h2>

        <h3>The other {otherSpies.length > 1 ? 'Spies are' : 'Spy is'}</h3>
        <ul>
          {otherSpies.map(player => (
            <li key={player.userId}>{player.name}</li>
          ))}
        </ul>

        <p>
          Your goal is to <strong>fail Missions</strong> and{' '}
          <strong>gain the trust of the Resistance players</strong>. You win if{' '}
          <strong>3</strong> Missions fail.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2>You are on the Resistance Team</h2>
      <p>
        Your goal is to <strong>succeed Missions</strong> and{' '}
        <strong>identify Spies</strong>. You win if <strong>3</strong> Missions
        succeed.
      </p>
    </div>
  );
};

export default TheResistanceRole;
