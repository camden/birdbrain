import React, { useState } from 'react';
import { ResistanceGameState } from '@server/store/games/the-resistance/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { rstAckTeamVoteResults } from '@server/store/games/the-resistance/actions';

export interface ResistanceProps {
  game: ResistanceGameState;
}

const TheResistanceShowTeamVotingResults: React.FC<ResistanceProps> = ({
  game,
}) => {
  const dispatch = useDispatch();
  const [acknowledged, setAcknowledged] = useState(false);

  const missionWasApproved =
    game.teamApprovalVotes.length > game.teamRejectVotes.length;

  const onContinueClick = () => {
    dispatch(sendMessage(rstAckTeamVoteResults()));
    setAcknowledged(true);
  };

  const missionApprovedRender = (
    <div>
      <h2>The mission was approved!</h2>
      {!acknowledged && (
        <Button onClick={onContinueClick}>Continue to Mission</Button>
      )}
    </div>
  );

  const missionRejectedRender = (
    <div>
      <h2>The mission was rejected!</h2>
      {!acknowledged && <Button onClick={onContinueClick}>Continue</Button>}
    </div>
  );

  return (
    <div>
      <h2>The votes are in!</h2>
      {game.players.map(player => (
        <li key={player.userId}>
          {player.name} voted{' '}
          <strong>
            {game.teamApprovalVotes.includes(player.userId)
              ? 'approve'
              : 'reject'}
          </strong>
        </li>
      ))}
      {missionWasApproved ? missionApprovedRender : missionRejectedRender}
    </div>
  );
};

export default TheResistanceShowTeamVotingResults;
