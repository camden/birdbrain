import React, { useState } from 'react';
import { ResistanceGameState } from '@server/store/games/the-resistance/types';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';

export interface ResistanceProps {
  game: ResistanceGameState;
}

const TheResistanceShowFinalResults: React.FC<ResistanceProps> = ({ game }) => {
  const dispatch = useDispatch();
  const [acknowledged, setAcknowledged] = useState(false);

  const onContinueClick = () => {
    setAcknowledged(true);
  };

  const resistanceWonTheGame =
    game.missionHistory.reduce(
      (resistanceScore, missionResult) =>
        missionResult.succeeded ? resistanceScore + 1 : resistanceScore,
      0
    ) === 3;

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
