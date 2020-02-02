import React, { useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import QueryString from 'query-string';
import { useDispatch } from 'react-redux';
import { connectToRoom } from 'store/websocket/actions';
import useSelector from 'store/use-selector';

// TODO this FC is getting sorta big. split this out in the future?
const Room: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const room = useSelector(state => state.room);

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

  return (
    <div>
      You're in a room called "{room.id}"!
      <div>
        Users here:
        <ul>
          {room.users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default withRouter(Room);
