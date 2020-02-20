import React from 'react';
import { ResistancePlayer } from '@server/store/games/the-resistance/types';

export interface ResistanceProps {
  playersThatNeedToAct: ResistancePlayer[];
  verb: string;
}

const WaitingMessage: React.FC<ResistanceProps> = ({
  playersThatNeedToAct,
  verb,
}) => {
  if (playersThatNeedToAct.length === 1) {
    return (
      <p>
        Waiting for <strong>{playersThatNeedToAct[0].name}</strong> to {verb}.
      </p>
    );
  }

  return (
    <p>
      Waiting for{' '}
      <strong>
        {playersThatNeedToAct
          .slice(0, -1)
          .map(p => p.name)
          .join(', ')}
      </strong>
      {playersThatNeedToAct.length > 2 && ','} and{' '}
      <strong>
        {playersThatNeedToAct[playersThatNeedToAct.length - 1].name}
      </strong>{' '}
      to {verb}.
    </p>
  );
};

export default WaitingMessage;
