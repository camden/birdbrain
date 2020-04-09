import React, { useCallback } from 'react';
import useSelector from 'store/use-selector';
import { getCurrentUser } from 'store/selectors';
import {
  MinidomGameState,
  MinidomCardType,
} from '@server/store/games/minidom/types';
import MinidomCard from './Card';
import Button from 'components/shared/button/Button';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import {
  domDrawCard,
  domPlayCardFromHand,
} from '@server/store/games/minidom/actions';
import MinidomGameBar from './GameBar';
import styles from './Main.module.css';
import { useCurrentPlayer } from 'utils/minidom-utils';
import MinidomCardRow from './CardRow';
import MinidomMap from './Map';
import MinidomMoveControls from './MoveControls';

export interface MainProps {
  game: MinidomGameState;
}

const MinidomMain: React.FC<MainProps> = ({ game }) => {
  const dispatch = useDispatch();
  const currentPlayer = useCurrentPlayer(game);

  const onPlayCardFromHand = useCallback(
    (card: MinidomCardType, cardIndex: number) => {
      dispatch(sendMessage(domPlayCardFromHand(cardIndex)));
    },
    []
  );

  return (
    <div className={styles.wrapper}>
      <MinidomGameBar game={game} />
      <MinidomMap game={game} />
      <MinidomMoveControls game={game} />
      <h2>hand:</h2>
      <MinidomCardRow
        cards={currentPlayer.collection.hand}
        onClick={onPlayCardFromHand}
      />
      <h2>deck:</h2>
      <MinidomCardRow hidden cards={currentPlayer.collection.deck} />
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
