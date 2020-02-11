import React, { useState } from 'react';
import {
  ResistanceGameState,
  ResistancePlayer,
  ResistanceTeamVote,
} from '@server/store/games/the-resistance/types';
import useSelector from 'store/use-selector';
import { getCurrentUser } from 'store/selectors';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { rstCastTeamVote } from '@server/store/games/the-resistance/actions';

export interface ResistanceProps {
  game: ResistanceGameState;
}

const TheResistanceVoteForTeam: React.FC<ResistanceProps> = ({ game }) => {
  const dispatch = useDispatch();
  const [voted, setVoted] = useState(false);

  if (!game.missionTeam) {
    return null;
  }

  const missionTeam = game.missionTeam.map(id =>
    game.players.find(player => player.userId === id)
  ) as ResistancePlayer[];

  const sendVote = (vote: ResistanceTeamVote) => {
    dispatch(sendMessage(rstCastTeamVote(vote)));
    setVoted(true);
  };

  const voteButtons = (
    <div>
      <Button onClick={() => sendVote(ResistanceTeamVote.APPROVE)}>
        Approve
      </Button>
      <Button onClick={() => sendVote(ResistanceTeamVote.REJECT)}>
        Reject
      </Button>
    </div>
  );

  return (
    <div>
      <h2>cast your vote for this team:</h2>
      <ul>
        {missionTeam.map(player => (
          <li key={player.userId}>{player.name}</li>
        ))}
      </ul>
      {!voted && voteButtons}
    </div>
  );
};

export default TheResistanceVoteForTeam;
