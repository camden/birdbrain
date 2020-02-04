import React, { useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import QueryString from 'query-string';
import { useDispatch } from 'react-redux';
import { connectToRoom } from 'store/websocket/actions';
import useSelector from 'store/use-selector';
import styles from './Room.module.css';

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
  const roomLeader = room.users.find(user => user.id === room.leaderUserID);

  return (
    <div className={styles.room}>
      You're in a room called "{room.id}"!
      <div className="room__users">
        Users here:
        <ul>
          {room.users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
      <div>
        {isRoomLeader ? 'You are' : `${roomLeader?.name} is`} the room leader!
      </div>
    </div>
  );
};

export default withRouter(Room);
