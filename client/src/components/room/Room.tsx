import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QueryString from 'query-string';
import { useDispatch } from 'react-redux';
import { connectToRoom } from 'store/websocket/actions';
import useSelector from 'store/use-selector';
import styles from './Room.module.css';
import LinkButton from 'components/shared/button/LinkButton';
import Game from 'components/games/Game';
import { sendStartGame } from 'messages/general-messages';
import {
  getIsRoomLeader,
  getUsersInRoom,
  getRoomLeader,
  getGame,
} from 'store/selectors';
import RoomBody from './RoomBody';

const Room: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const room = useSelector(state => state.room);
  const isRoomLeader = useSelector(getIsRoomLeader());
  const usersInRoom = useSelector(getUsersInRoom());
  const roomLeader = useSelector(getRoomLeader());
  const game = useSelector(getGame());

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
  }, [id, dispatch]);

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

  return (
    <RoomBody
      room={room}
      isCurrentUserRoomLeader={isRoomLeader}
      onStartGameClick={() => dispatch(sendStartGame())}
      roomLeader={roomLeader}
      usersInRoom={usersInRoom}
    />
  );
};

export default Room;
