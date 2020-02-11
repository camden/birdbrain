import React from 'react';
import {
  ResistanceGameState,
  ResistancePlayer,
} from '@server/store/games/the-resistance/types';
import useSelector from 'store/use-selector';
import { getCurrentUser } from 'store/selectors';
import Button from 'components/shared/button/Button';

export interface ResistanceProps {
  game: ResistanceGameState;
}

const TheResistanceVoteForTeam: React.FC<ResistanceProps> = ({ game }) => {
  const user = useSelector(getCurrentUser());

  if (!game.missionTeam) {
    return null;
  }

  const missionTeam = game.missionTeam.map(id =>
    game.players.find(player => player.userId === id)
  ) as ResistancePlayer[];

  return (
    <div>
      <h2>cast your vote for this team:</h2>
      <ul>
        {missionTeam.map(player => (
          <li key={player.userId}>{player.name}</li>
        ))}
      </ul>
      <Button>Approve</Button>
      <Button>Reject</Button>
    </div>
  );
};

export default TheResistanceVoteForTeam;
