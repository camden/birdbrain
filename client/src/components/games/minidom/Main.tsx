import React from 'react';
import { MinidomGameState } from '@server/store/games/minidom/types';
import MinidomGameBar from './GameBar';
import styles from './Main.module.css';
import { useCurrentPlayer } from 'utils/minidom-utils';
import MinidomMap from './Map';
import MinidomMainInput from './MainInput';
import MinidomCardRow from './CardRow';

export interface MainProps {
  game: MinidomGameState;
}

const MinidomMain: React.FC<MainProps> = ({ game }) => {
  const currentPlayer = useCurrentPlayer(game);

  const activePlayer = game.players[game.activePlayerIndex];
  const isActivePlayer = activePlayer.userId === currentPlayer.userId;

  return (
    <div className={styles.wrapper}>
      <MinidomGameBar game={game} />
      <h2>Phase: {game.currentTurnPhase}</h2>
      <h2>{activePlayer.name}'s turn</h2>
      <MinidomMap game={game} />
      {isActivePlayer && <MinidomMainInput game={game} />}
      <div>hand</div>
      <MinidomCardRow cards={currentPlayer.collection.hand} />
      <div>deck</div>
      <MinidomCardRow cards={currentPlayer.collection.deck} hidden />
      <div>discard pile:</div>
      <MinidomCardRow cards={currentPlayer.collection.discardPile} />
    </div>
  );
};

export default MinidomMain;
