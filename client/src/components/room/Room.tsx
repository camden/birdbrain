import React, { useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import QueryString from 'query-string';
import { useDispatch } from 'react-redux';
import { connectToRoom } from 'store/websocket/actions';
import useSelector from 'store/use-selector';
import styles from './Room.module.css';
import Button from 'components/shared/button/Button';
import { sendStartGame } from 'messages/general-messages';

// TODO this FC is getting sorta big. split this out in the future?
const Room: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const room = useSelector(state => state.room);
  const user = useSelector(state => state.user);

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

  const isRoomLeader = user?.id === room.leaderUserID;
  const roomLeader = room.users.find(userId => userId === room.leaderUserID);

  return (
    <div className={styles.room}>
      You're in a room called "{room.id}"!
      <div className="room__users">
        Users here:
        <ul>
          {room.users.map(userId => (
            <li key={userId}>{userId}</li>
          ))}
        </ul>
      </div>
      {!isRoomLeader && <div>{roomLeader} is the room leader!</div>}
      {isRoomLeader && (
        <Button onClick={() => dispatch(sendStartGame())}>Start game</Button>
      )}
    </div>
  );
};

export default withRouter(Room);
