import React, { useState } from 'react';
import { ResistanceGameState } from '@server/store/games/the-resistance/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { rstAckTeamVoteResults } from '@server/store/games/the-resistance/actions';
import User from 'components/shared/user/User';
import { faThumbsUp, faThumbsDown } from '@fortawesome/pro-solid-svg-icons';
import WaitingMessage from './WaitingMessage';

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

  const allUsersWhoAcked = game.acknowledged;
  const playersWhoStillNeedToAck = game.players.filter(
    player => !allUsersWhoAcked.includes(player.userId)
  );

  return (
    <div>
      <h2>The votes are in!</h2>
      {game.players.map(player => (
        <User
          user={{ id: player.userId, name: player.name }}
          key={player.userId}
          icon={
            game.teamApprovalVotes.includes(player.userId)
              ? faThumbsUp
              : faThumbsDown
          }
          iconColor={
            game.teamApprovalVotes.includes(player.userId) ? '#00ce00' : 'red'
          }
        />
      ))}
      {missionWasApproved ? missionApprovedRender : missionRejectedRender}
      <WaitingMessage
        playersThatNeedToAct={playersWhoStillNeedToAck}
        verb={'move on'}
      />
    </div>
  );
};

export default TheResistanceShowTeamVotingResults;
