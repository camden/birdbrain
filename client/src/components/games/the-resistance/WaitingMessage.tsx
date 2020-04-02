import React from 'react';
import { faClock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface WaitingMessageProps {
  playersThatNeedToAct: string[];
  verb: string;
}

const WaitingMessage: React.FC<WaitingMessageProps> = ({
  playersThatNeedToAct,
  verb,
}) => {
  if (playersThatNeedToAct.length === 1) {
    return (
      <p>
        <FontAwesomeIcon icon={faClock} style={{ marginRight: '0.25em' }} />{' '}
        Waiting for <strong>{playersThatNeedToAct[0]}</strong> to {verb}.
      </p>
    );
  }

  return (
    <p>
      Waiting for{' '}
      <strong>{playersThatNeedToAct.slice(0, -1).join(', ')}</strong>
      {playersThatNeedToAct.length > 2 && ','} and{' '}
      <strong>{playersThatNeedToAct[playersThatNeedToAct.length - 1]}</strong>{' '}
      to {verb}.
    </p>
  );
};

export default WaitingMessage;
