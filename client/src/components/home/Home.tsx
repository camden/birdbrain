import React, { useState, useCallback } from 'react';
import birdbrainLogo from 'assets/images/birdbrain-logo.svg';
import axios from 'axios';
import styles from './Home.module.css';
import { Redirect, Link } from 'react-router-dom';
import Button from 'components/shared/button/Button';
import QueryString from 'query-string';
import LinkButton from 'components/shared/button/LinkButton';
import TextInput from 'components/shared/input/TextInput';

const getRoomViaAPI = async (roomCode: string, name: string) => {
  try {
    const res = await axios.get(`/api/room/${roomCode}`);
    return res.data;
  } catch {
    return null;
  }
};

const getQueryStringValue = (key: string) => {
  const values = QueryString.parse(window.location.search);
  return values[key] as string;
};

const createRoomViaAPI = async (): Promise<{ roomId: string } | null> => {
  try {
    const res = await axios.post(`/api/room/`);
    return res.data;
  } catch {
    return null;
  }
};

const Home: React.FC = () => {
  const [roomCode, setRoomCode] = useState(getQueryStringValue('room') || '');
  const [name, setName] = useState('');
  const [isLoadingJoin, setIsLoadingJoin] = useState(false);
  const [isJoinSuccessful, setIsJoinSuccessful] = useState(false);

  const createRoomCallback = useCallback(async () => {
    if (isLoadingJoin) {
      return;
    }

    if (!name) {
      alert("What's your name?");
      return;
    }

    setIsLoadingJoin(true);
    const response = await createRoomViaAPI();
    setIsLoadingJoin(false);

    if (!response) {
      return;
    }

    const roomId = response.roomId;
    setRoomCode(roomId);
    setIsJoinSuccessful(true);
  }, [name, isLoadingJoin]);

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
    return <Redirect push to={`/room/${roomCode}?name=${name}`} />;
  }

  const showCreateRoomOption = !getQueryStringValue('room');

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <Link
          to="/"
          onClick={() => {
            window.history.replaceState(null, '', window.location.pathname);
            window.location.reload();
          }}
        >
          <img
            src={birdbrainLogo}
            className={styles.birdbrain_logo}
            alt="logo"
          />
        </Link>
      </header>
      <section className={styles.body}>
        <section className={styles.input_section}>
          <label htmlFor="room-code" className={styles.label}>
            Room Code
          </label>
          <TextInput
            id="room-code"
            name="called-search-to-disable-autocomplete1"
            placeholder="Room Code"
            value={roomCode}
            onKeyPress={event =>
              event.key === 'Enter' ? joinRoomCallback() : null
            }
            onChange={event => setRoomCode(event.target.value.toUpperCase())}
            className={styles.join_room_input}
            autoComplete="off"
          />
          <label htmlFor="user-name" className={styles.label}>
            Name
          </label>
          <TextInput
            id="user-name"
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
          <Button
            onClick={joinRoomCallback}
            className={styles.button}
            disabled={isLoadingJoin}
          >
            {isLoadingJoin ? <div>loading...</div> : 'Join Room'}
          </Button>
        </section>
        {showCreateRoomOption && (
          <>
            <div className={styles.input_section_divider}>OR</div>
            <section className={styles.input_section}>
              <LinkButton
                to={'/create-room'}
                className={styles.button}
                disabled={isLoadingJoin}
              >
                {isLoadingJoin ? <div>loading...</div> : 'Create Room'}
              </LinkButton>
            </section>
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
