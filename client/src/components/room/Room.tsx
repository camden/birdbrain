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
    return <Game />;
  }

  return (
    <div className={styles.room}>
      You're in a room called "{room.id}"!
      <div className="room__users">
        Users here:
        <div>
          {usersInRoom.map(user => (
            <User key={user.id} user={user} />
          ))}
        </div>
      </div>
      {!isRoomLeader && <div>{roomLeader?.name} is the room leader!</div>}
      {isRoomLeader && (
        <Button onClick={() => dispatch(sendStartGame())}>Start game</Button>
      )}
    </div>
  );
};

export default withRouter(Room);
