import React from 'react';
import useSelector from 'store/use-selector';
import { getGame } from 'store/selectors';
import { GameType } from '@server/store/games/types';
import TheResistanceMain from './the-resistance/Main';
import { ResistanceGameState } from '@server/store/games/the-resistance/types';
import { Room } from '@server/store/general/types';
import SkullMain from './skull/SkullMain';
import { SkullGameState } from '@server/store/games/skull/types';
import ChatMain from './chat/ChatMain';
import { ChatGameState } from '@server/store/games/chat/types';
import FishbowlMain from './fishbowl/Main';
import { FishbowlGameState } from '@server/store/games/fishbowl/types';
import MinidomMain from './minidom/Main';
import { MinidomGameState } from '@server/store/games/minidom/types';
import PongMain from './pong/Main';
import { PongGameState } from '@server/store/games/pong/types';
import { LudumGameState } from '@server/store/games/ludum-dare/types';
import LudumMain from './ludum-dare/Main';

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
    case GameType.CHAT:
      return <ChatMain game={game as ChatGameState} room={room} />;
    case GameType.FISHBOWL:
      return <FishbowlMain game={game as FishbowlGameState} room={room} />;
    case GameType.MINIDOM:
      return <MinidomMain game={game as MinidomGameState} />;
    case GameType.PONG:
      return <PongMain game={game as PongGameState} />;
    case GameType.LUDUM:
      return <LudumMain game={game as LudumGameState} />;
  }

  return <div>game not found</div>;
};

export default Game;
