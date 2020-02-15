import React, { useState } from 'react';
import {
  ResistanceGameState,
  ResistanceMissionStatus,
} from '@server/store/games/the-resistance/types';
import Button from 'components/shared/button/Button';

export interface ResistanceProps {
  game: ResistanceGameState;
}

const TheResistanceShowFinalResults: React.FC<ResistanceProps> = ({ game }) => {
  const [acknowledged, setAcknowledged] = useState(false);

  const onContinueClick = () => {
    setAcknowledged(true);
  };

  const resistanceWonTheGame =
    game.allMissions.filter(
      mission => mission.status === ResistanceMissionStatus.SUCCEEDED
    ).length === 3;

  return (
    <div>
      <h2>The final results are in!</h2>
      {resistanceWonTheGame ? (
        <div>The Resistance has won!</div>
      ) : (
        <div>The Spies have won!</div>
      )}
      {!acknowledged && <Button onClick={onContinueClick}>Back to Room</Button>}
    </div>
  );
};

export default TheResistanceShowFinalResults;
