import React from 'react';
import useSelector from 'store/use-selector';
import { getGame } from 'store/selectors';
import { GameType } from '@server/store/games/types';
import TheResistanceMain from './the-resistance/TheResistanceMain';
import { ResistanceGameState } from '@server/store/games/the-resistance/types';

const Game = () => {
  const game = useSelector(getGame());

  switch (game?.type) {
    case GameType.THE_RESISTANCE:
      return <TheResistanceMain game={game as ResistanceGameState} />;
  }

  return <div>game</div>;
};

export default Game;
