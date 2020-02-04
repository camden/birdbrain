import React, { useState, useCallback } from 'react';
import birdbrainLogo from 'assets/images/birdbrain-logo.svg';
import axios from 'axios';
import styles from './Home.module.css';
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
    <div className={styles.home}>
      <header className={styles.home__header}>
        <img src={birdbrainLogo} className={styles.birdbrain_logo} alt="logo" />
      </header>
      <section className={styles.home__body}>
        <section className={styles.home__input_section}>
          <input
            type="text"
            placeholder="Room Code"
            value={roomCode}
            onChange={event => setRoomCode(event.target.value)}
            className={styles.home__join_room_input}
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={event => setName(event.target.value)}
            onKeyPress={event =>
              event.key === 'Enter' ? joinRoomCallback() : null
            }
            className={styles.home__join_room_input}
          />
          <button onClick={joinRoomCallback} className={styles.button}>
            {isLoadingJoin ? <div>loading...</div> : 'Join Room'}
          </button>
        </section>
        <div className={styles.home__input_section_divider}>OR</div>
        <section className={styles.home__input_section}>
          <button
            onClick={() => {
              alert('not implemented');
            }}
            className={styles.button}
          >
            Create Room
          </button>
        </section>
      </section>
    </div>
  );
};

export default Home;
