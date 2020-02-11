import React, { useState } from 'react';
import { ResistanceGameState } from '@server/store/games/the-resistance/types';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { rstAckMissionVoteResults } from '@server/store/games/the-resistance/actions';
import Button from 'components/shared/button/Button';

export interface ResistanceProps {
  game: ResistanceGameState;
}

const TheResistanceShowMissionVotingResults: React.FC<ResistanceProps> = ({
  game,
}) => {
  const dispatch = useDispatch();
  const [acknowledged, setAcknowledged] = useState(false);

  const onContinueClick = () => {
    dispatch(sendMessage(rstAckMissionVoteResults()));
    setAcknowledged(true);
  };

  const currentMission = game.allMissions[game.mission - 1];
  const missionSucceeded = currentMission.requiresTwoFails
    ? game.missionFailVotes.length < 2
    : game.missionFailVotes.length === 0;

  return (
    <div>
      <h2>The results are in!</h2>
      {game.missionSuccessVotes.map(vote => (
        <div>Success</div>
      ))}
      {game.missionFailVotes.map(vote => (
        <div>Fail</div>
      ))}
      <h2>
        {missionSucceeded
          ? 'This mission has succeeded!'
          : 'This mission has failed!'}
      </h2>
      {!acknowledged && <Button onClick={onContinueClick}>Continue</Button>}
    </div>
  );
};

export default TheResistanceShowMissionVotingResults;
