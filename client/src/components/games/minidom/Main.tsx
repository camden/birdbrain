import React from 'react';
import useSelector from 'store/use-selector';
import { getCurrentUser } from 'store/selectors';
import { MinidomGameState } from '@server/store/games/minidom/types';
import MinidomCard from './Card';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { domDrawCard } from '@server/store/games/minidom/actions';
import MinidomGameBar from './GameBar';
import styles from './Main.module.css';
import { useCurrentPlayer } from 'utils/minidom-utils';

export interface MainProps {
  game: MinidomGameState;
}

const MinidomMain: React.FC<MainProps> = ({ game }) => {
  const dispatch = useDispatch();
  const currentPlayer = useCurrentPlayer(game);

  return (
    <div className={styles.wrapper}>
      <MinidomGameBar game={game} />
      <h1>minidom!</h1>
      <h2>hand:</h2>
      {currentPlayer.collection.hand.map(card => (
        <MinidomCard card={card} />
      ))}
      <h2>deck:</h2>
      {currentPlayer.collection.deck.map(card => (
        <MinidomCard card={card} />
      ))}
      <h2>discard pile:</h2>
      {currentPlayer.collection.discardPile.map(card => (
        <MinidomCard card={card} />
      ))}
      <Button
        onClick={() => {
          dispatch(sendMessage(domDrawCard()));
        }}
      >
        Draw a card
      </Button>
    </div>
  );
};

export default MinidomMain;
