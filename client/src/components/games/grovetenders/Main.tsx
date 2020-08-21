import React from 'react';
import { GroveGameState } from '@server/store/games/grovetenders/types';
import GroveGameBar from './GameBar';
import styles from './Main.module.css';
import { useCurrentPlayer } from 'utils/grovetenders-utils';
import GroveMap from './Map';
import GroveMainInput from './MainInput';
import GroveCardRow from './CardRow';

export interface MainProps {
  game: GroveGameState;
}

const GroveMain: React.FC<MainProps> = ({ game }) => {
  const currentPlayer = useCurrentPlayer(game);

  const activePlayer = game.players[game.activePlayerIndex];
  const isActivePlayer = activePlayer.userId === currentPlayer.userId;

  return (
    <div className={styles.wrapper}>
      <GroveGameBar game={game} />
      <h2>Phase: {game.currentTurnPhase}</h2>
      <h2>{activePlayer.name}'s turn</h2>
      <GroveMap game={game} />
      {isActivePlayer && <GroveMainInput game={game} />}
      <div>deck</div>
      <GroveCardRow cards={currentPlayer.collection.deck} hidden />
      <div>discard pile:</div>
      <GroveCardRow cards={currentPlayer.collection.discardPile} hidden />
    </div>
  );
};

export default GroveMain;
