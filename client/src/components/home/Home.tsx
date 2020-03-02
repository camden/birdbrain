import React, { useState, useCallback } from 'react';
import axios from 'axios';
import styles from './Home.module.css';
import { Redirect } from 'react-router-dom';
import Button from 'components/shared/button/Button';
import QueryString from 'query-string';
import LinkButton from 'components/shared/button/LinkButton';
import TextInput from 'components/shared/form/TextInput';
import LogoHeader from 'components/shared/logo-header/LogoHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey } from '@fortawesome/pro-solid-svg-icons';

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

const Home: React.FC = () => {
  const [roomCode, setRoomCode] = useState(getQueryStringValue('room') || '');
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
    return <Redirect push to={`/room/${roomCode}?name=${name}`} />;
  }

  const showCreateRoomOption = !getQueryStringValue('room');

  return (
    <div className={styles.home}>
      <LogoHeader />
      <section className={styles.body}>
        <section className={styles.input_section}>
          <label htmlFor="room-code" className={styles.label}>
            <FontAwesomeIcon icon={faKey} className={styles.label_icon} />
            Room Code
          </label>
          <TextInput
            id="room-code"
            name="called-search-to-disable-autocomplete1"
            value={roomCode}
            onKeyPress={event =>
              event.key === 'Enter' ? joinRoomCallback() : null
            }
            onChange={event => setRoomCode(event.target.value.toUpperCase())}
            className={styles.join_room_input}
            autoComplete="off"
          />
          <label htmlFor="user-name" className={styles.label}>
            <FontAwesomeIcon icon={faUser} className={styles.label_icon} />
            Your Name
          </label>
          <TextInput
            id="user-name"
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
                {isLoadingJoin ? <div>loading...</div> : 'Create New Room'}
              </LinkButton>
            </section>
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
