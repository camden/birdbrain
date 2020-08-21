import React, { useCallback } from 'react';
import {
  GroveGameState,
  GroveTurnPhase,
} from '@server/store/games/grovetenders/types';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { groveDummyAction } from '@server/store/games/grovetenders/actions';
import { useCurrentPlayer } from 'utils/grovetenders-utils';
import GroveMoveControls from './MoveControls';
import Button from 'components/shared/button/Button';

export interface GroveMainInputProps {
  game: GroveGameState;
}

const GroveMainInput: React.FC<GroveMainInputProps> = ({ game }) => {
  const dispatch = useDispatch();
  const currentPlayer = useCurrentPlayer(game);

  return <div>main</div>;
};

export default GroveMainInput;
