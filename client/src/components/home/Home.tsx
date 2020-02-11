import React, { useState, useCallback } from 'react';
import birdbrainLogo from 'assets/images/birdbrain-logo.svg';
import axios from 'axios';
import styles from './Home.module.css';
import { Redirect } from 'react-router-dom';
import Button from 'components/shared/button/Button';

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
      <header className={styles.header}>
        <img src={birdbrainLogo} className={styles.birdbrain_logo} alt="logo" />
      </header>
      <section className={styles.body}>
        <section className={styles.input_section}>
          <input
            type="text"
            name="called-search-to-disable-autocomplete1"
            placeholder="Room Code"
            value={roomCode}
            onChange={event => setRoomCode(event.target.value)}
            className={styles.join_room_input}
            autoComplete="off"
          />
          <input
            type="text"
            placeholder="Name"
            name="called-search-to-disable-autocomplete2"
            value={name}
            onChange={event => setName(event.target.value)}
            onKeyPress={event =>
              event.key === 'Enter' ? joinRoomCallback() : null
            }
            className={styles.join_room_input}
            autoComplete="off"
          />
          <Button onClick={joinRoomCallback} className={styles.button}>
            {isLoadingJoin ? <div>loading...</div> : 'Join Room'}
          </Button>
        </section>
        <div className={styles.input_section_divider}>OR</div>
        <section className={styles.input_section}>
          <Button
            onClick={() => {
              alert('not implemented');
            }}
            className={styles.button}
          >
            Create Room
          </Button>
        </section>
      </section>
    </div>
  );
};

export default Home;
