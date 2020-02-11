import React from 'react';
import { ResistanceGameState } from '@server/store/games/the-resistance/types';
import useSelector from 'store/use-selector';
import { getCurrentUser } from 'store/selectors';

export interface ResistanceProps {
  game: ResistanceGameState;
}

const TheResistancePickTeam: React.FC<ResistanceProps> = ({ game }) => {
  const user = useSelector(getCurrentUser());

  if (user?.id !== game.missionLeader.userId) {
    return <div>waiting for leader to pick team.</div>;
  }

  return (
    <div>
      <h2>you are the leader. pick a team!</h2>
    </div>
  );
};

export default TheResistancePickTeam;
