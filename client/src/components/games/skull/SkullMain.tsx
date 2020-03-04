import React from 'react';
import { SkullGameState } from '@server/store/games/skull/types';
import { Room } from '@server/store/general/types';

export interface SkullProps {
  game: SkullGameState;
  room: Room;
}

const SkullMain: React.FC<SkullProps> = props => {
  return <div>skull game!</div>;
};

export default SkullMain;
