import React from 'react';
import useSelector from 'store/use-selector';
import { getGame } from 'store/selectors';
import { GameType } from '@server/store/games/types';
import TheResistanceMain from './the-resistance/Main';
import { ResistanceGameState } from '@server/store/games/the-resistance/types';
import { Room } from '@server/store/general/types';
import SkullMain from './skull/SkullMain';
import { SkullGameState } from '@server/store/games/skull/types';

export interface GameProps {
  room: Room;
}

const Game: React.FC<GameProps> = ({ room }) => {
  const game = useSelector(getGame());

  switch (game?.type) {
    case GameType.THE_RESISTANCE:
      return (
        <TheResistanceMain game={game as ResistanceGameState} room={room} />
      );
    case GameType.SKULL:
      return <SkullMain game={game as SkullGameState} room={room} />;
  }

  return <div>game</div>;
};

export default Game;
