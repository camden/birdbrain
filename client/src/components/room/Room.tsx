import React, { useEffect } from 'react';
import { useParams, RouteComponentProps, withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import QueryString from 'query-string';

const connectToRoom = (roomCode: string, name: string) => {
  const socket = io({ query: { roomId: roomCode, name } });

  socket.on('joined', (data: any) => {
    alert('got data!');
    console.log(data);
  });
};

const Room: React.FC = () => {
  const { id } = useParams();

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

    connectToRoom(id, name);
  }, []);

  return <div>you're in a room called {id}!</div>;
};

export default withRouter(Room);
