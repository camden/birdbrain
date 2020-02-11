import React, { useState } from 'react';
import {
  ResistanceGameState,
  ResistancePlayer,
  ResistanceMissionVote,
  ResistanceRole,
} from '@server/store/games/the-resistance/types';
import useSelector from 'store/use-selector';
import { getCurrentUser } from 'store/selectors';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { rstCastMissionVote } from '@server/store/games/the-resistance/actions';

export interface ResistanceProps {
  game: ResistanceGameState;
}

const TheResistanceConductMission: React.FC<ResistanceProps> = ({ game }) => {
  const user = useSelector(getCurrentUser());
  const dispatch = useDispatch();
  const [voted, setVoted] = useState(false);

  if (!game.missionTeam || !user) {
    return null;
  }

  const missionTeam = game.missionTeam.map(id =>
    game.players.find(player => player.userId === id)
  ) as ResistancePlayer[];

  const currentUserIsOnTeam = game.missionTeam.includes(user.id);
  const currentPlayer = game.players.find(
    player => player.userId === user.id
  ) as ResistancePlayer;

  const onVoteClick = (vote: ResistanceMissionVote) => {
    dispatch(sendMessage(rstCastMissionVote(vote)));
    setVoted(true);
  };

  const successButton = (
    <Button onClick={() => onVoteClick(ResistanceMissionVote.SUCCESS)}>
      Success
    </Button>
  );

  const failButton = (
    <Button
      onClick={() => onVoteClick(ResistanceMissionVote.FAIL)}
      disabled={currentPlayer.role === ResistanceRole.Resistance}
    >
      Fail
    </Button>
  );

  const voteButtons = (
    <div>
      {successButton}
      {failButton}
    </div>
  );

  return (
    <div>
      <h2>The mission team is now conducting Mission {game.mission}.</h2>
      <ul>
        {missionTeam.map(player => (
          <li key={player.userId}>{player.name}</li>
        ))}
      </ul>
      {!voted && currentUserIsOnTeam && voteButtons}
    </div>
  );
};

export default TheResistanceConductMission;
