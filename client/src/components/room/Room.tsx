import React, { useEffect } from 'react';
import { useParams, withRouter, Redirect } from 'react-router-dom';
import QueryString from 'query-string';
import { useDispatch } from 'react-redux';
import { connectToRoom } from 'store/websocket/actions';
import useSelector from 'store/use-selector';
import styles from './Room.module.css';
import Button from 'components/shared/button/Button';
import User from 'components/shared/user/User';
import Game from 'components/games/Game';
import { sendStartGame } from 'messages/general-messages';
import {
  getIsRoomLeader,
  getUsersInRoom,
  getRoomLeader,
  getGame,
} from 'store/selectors';
import TopBar from 'components/shared/top-bar/TopBar';

// TODO this FC is getting sorta big. split this out in the future?
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
    return <div>Room '{id}' does not exist.</div>;
  }

  if (game) {
    return <Game room={room} />;
  }

  return (
    <div className={styles.room}>
      <TopBar room={room} />
      <main className={styles.room_body}>
        <div className={styles.user_list}>
          {usersInRoom.map(user => (
            <User
              key={user.id}
              user={user}
              isLeader={roomLeader?.id === user.id}
            />
          ))}
        </div>
        {!isRoomLeader && (
          <div>Waiting for {roomLeader?.name} to start the game.</div>
        )}
        {isRoomLeader && (
          <Button onClick={() => dispatch(sendStartGame())}>Start game</Button>
        )}
      </main>
    </div>
  );
};

export default withRouter(Room);
