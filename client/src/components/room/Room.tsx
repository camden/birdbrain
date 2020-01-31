import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import QueryString from 'query-string';

const connectToRoom = (
  roomCode: string,
  name: string,
  setRoomState: (data: any) => void
) => {
  const devUrl = 'http://localhost:8080';
  const prodUrl = '/';
  const url = process.env.REACT_APP_EXTERNAL_CLIENT ? devUrl : prodUrl;
  console.log(process.env.REACT_APP_EXTERNAL_CLIENT);
  const socket = io.connect(url, {
    query: { roomId: roomCode, name },
  });

  socket.on('join-or-leave-messages', (data: any) => {
    console.log(data);
  });

  socket.on('room-state', (data: any) => {
    console.log('room state: ', data);
    setRoomState(data);
  });
};

interface User {
  id: string;
  name: string;
}

const Room: React.FC = () => {
  const { id } = useParams();
  const [roomState, setRoomState] = useState(null);

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

    connectToRoom(id, name, setRoomState);
  }, [id]);

  console.log(roomState);

  return (
    <div>
      You're in a room called {id}!
      <div>
        Users here:
        <ul>
          {/* {usersInRoom.map(user => (
            <li key={user.id}>{user.name}</li>
          ))} */}
        </ul>
      </div>
    </div>
  );
};

export default withRouter(Room);
