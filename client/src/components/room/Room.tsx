import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QueryString from 'query-string';
import { useDispatch } from 'react-redux';
import { connectToRoom } from 'store/websocket/actions';
import useSelector from 'store/use-selector';
import styles from './Room.module.css';
import LinkButton from 'components/shared/button/LinkButton';
import Game from 'components/games/Game';
import { sendStartGame, sendPickGame } from 'messages/general-messages';
import {
  getIsRoomLeader,
  getUsersInRoom,
  getRoomLeader,
  getGame,
} from 'store/selectors';
import RoomBody from './RoomBody';
import PickGame from './PickGame';
import { GameType } from '@server/store/games/types';
import { faSpinnerThird } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'components/shared/button/Button';

const LOADING_TIMEOUT_MS = process.env.NODE_ENV === 'production' ? 1000 : 250;

const Room: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const room = useSelector((state) => state.room);
  const isRoomLeader = useSelector(getIsRoomLeader());
  const usersInRoom = useSelector(getUsersInRoom());
  const roomLeader = useSelector(getRoomLeader());
  const game = useSelector(getGame());

  const [isLoading, setIsLoading] = useState(true);
  const [isPickingGame, setIsPickingGame] = useState(false);

  const query = QueryString.parse(window.location.search);
  const hasDevQuery = query && !!query.dev;
  const hasDevLocalStorage = !!localStorage.getItem(
    'birdbrain__show_dev_games'
  );
  const showDevGames = hasDevQuery || hasDevLocalStorage;

  useEffect(() => {
    if (!id) {
      return;
    }

    const obj = QueryString.parse(window.location.search);
    if (!obj) {
      // throw an error here because no name was supplied!!
      alert('error: no name supplied');
      return;
    }

    const name = obj.name as string;

    dispatch(connectToRoom(id, name));

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, LOADING_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [id, dispatch]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <FontAwesomeIcon icon={faSpinnerThird} size="5x" spin />
      </div>
    );
  }

  if (!room) {
    return (
      <div className={styles.room_body}>
        <h1>Room '{id}' does not exist.</h1>
        <LinkButton to={'/'}>Go Home</LinkButton>
      </div>
    );
  }

  if (game) {
    return <Game room={room} />;
  }

  if (!roomLeader) {
    return <div>No game leader found for room "{room.id}".</div>;
  }

  if (isPickingGame) {
    return (
      <PickGame
        showDevGames={showDevGames}
        room={room}
        onCancel={() => setIsPickingGame(false)}
        onPickGame={(game: GameType) => {
          setIsPickingGame(false);
          dispatch(sendPickGame(game));
        }}
      />
    );
  }

  return (
    <>
      {hasDevQuery && !hasDevLocalStorage && (
        <Button
          onClick={() =>
            localStorage.setItem('birdbrain__show_dev_games', 'true')
          }
        >
          Always show dev games
        </Button>
      )}
      {hasDevQuery && hasDevLocalStorage && (
        <Button
          onClick={() => localStorage.removeItem('birdbrain__show_dev_games')}
        >
          Hide dev games
        </Button>
      )}
      <RoomBody
        room={room}
        isCurrentUserRoomLeader={isRoomLeader}
        onStartGameClick={() => dispatch(sendStartGame())}
        onChangeGameClick={() => setIsPickingGame(true)}
        roomLeader={roomLeader}
        usersInRoom={usersInRoom}
      />
    </>
  );
};

export default Room;
