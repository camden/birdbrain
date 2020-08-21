import React, { useCallback } from 'react';
import { GroveGameState } from '@server/store/games/grovetenders/types';
import { useDispatch } from 'react-redux';

export interface GroveMoveControlsProps {
  game: GroveGameState;
}

const GroveMoveControls: React.FC<GroveMoveControlsProps> = (props) => {
  const dispatch = useDispatch();

  return <div>move controls</div>;
};

export default GroveMoveControls;
