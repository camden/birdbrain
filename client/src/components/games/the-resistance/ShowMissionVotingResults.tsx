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

  return (
    <div>
      <h2>The results are in!</h2>
      {game.missionSuccessVotes.map(vote => (
        <div>Success</div>
      ))}
      {game.missionFailVotes.map(vote => (
        <div>Fail</div>
      ))}
      {!acknowledged && <Button onClick={onContinueClick}>Continue</Button>}
    </div>
  );
};

export default TheResistanceShowMissionVotingResults;
