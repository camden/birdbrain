import React, { useState, useCallback } from 'react';
import birdbrainLogo from 'assets/images/birdbrain-logo.svg';
import axios from 'axios';
import './Home.css';
import { Redirect } from 'react-router-dom';

const getRoomViaAPI = async (roomCode: string, name: string) => {
  console.log(`Attempting to join room '${roomCode}' as '${name}'.`);

  try {
    const res = await axios.get(`/api/room/${roomCode}`);
    return res.data;
  } catch {
    return null;
  }
};

const Home: React.FC = () => {
  const [roomCode, setRoomCode] = useState('');
  const [name, setName] = useState('');
  const [isLoadingJoin, setIsLoadingJoin] = useState(false);
  const [isJoinSuccessful, setIsJoinSuccessful] = useState(false);

  const joinRoomCallback = useCallback(async () => {
    if (isLoadingJoin) {
      return;
    }

    if (!roomCode || !name) {
      return;
    }

    setIsLoadingJoin(true);

    const room = await getRoomViaAPI(roomCode, name);

    if (!room) {
      setRoomCode('');
    } else {
      setIsJoinSuccessful(true);
    }

    setIsLoadingJoin(false);
  }, [name, roomCode, isLoadingJoin]);

  if (isJoinSuccessful) {
    return <Redirect to={`/room/${roomCode}?name=${name}`} />;
  }

  return (
    <div className="home">
      <header className="home__header">
        <img src={birdbrainLogo} className="birdbrain-logo" alt="logo" />
      </header>
      <section className="home__body">
        <section className="home__input-section">
          <input
            type="text"
            placeholder="Room Code"
            value={roomCode}
            onChange={event => setRoomCode(event.target.value)}
            className="home__join-room-input"
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={event => setName(event.target.value)}
            onKeyPress={event =>
              event.key === 'Enter' ? joinRoomCallback() : null
            }
            className="home__join-room-input"
          />
          <button onClick={joinRoomCallback} className="button home__button">
            {isLoadingJoin ? <div>loading...</div> : 'Join Room'}
          </button>
        </section>
        <div className="home__input-section-divider">OR</div>
        <section className="home__input-section">
          <button
            onClick={() => {
              alert('not implemented');
            }}
            className="button home__button"
          >
            Create Room
          </button>
        </section>
      </section>
    </div>
  );
};

export default Home;
