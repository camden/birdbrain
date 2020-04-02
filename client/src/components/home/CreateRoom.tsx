import React, { useState, useCallback } from 'react';
import axios from 'axios';
import Button from 'components/shared/button/Button';
import TextInput from 'components/shared/form/TextInput';
import styles from './CreateRoom.module.css';
import { Redirect } from 'react-router-dom';
import LogoHeader from 'components/shared/logo-header/LogoHeader';
import { faUser } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const createRoomViaAPI = async (): Promise<{ roomId: string } | null> => {
  try {
    const res = await axios.post(`/api/room/`);
    return res.data;
  } catch {
    return null;
  }
};

const CreateRoom = () => {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isJoinSuccessful, setIsJoinSuccessful] = useState(false);

  const createRoomCallback = useCallback(async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    const response = await createRoomViaAPI();
    setIsLoading(false);

    if (!response) {
      return;
    }

    const roomId = response.roomId;
    setRoomCode(roomId);
    setIsJoinSuccessful(true);
  }, [isLoading]);

  if (isJoinSuccessful) {
    return <Redirect push to={`/room/${roomCode}?name=${name}`} />;
  }

  return (
    <div className={styles.create_room}>
      <LogoHeader />
      <label className={styles.label} htmlFor="user-name">
        <FontAwesomeIcon icon={faUser} className={styles.icon} />
        Your Name
      </label>
      <TextInput
        id="user-name"
        value={name}
        onChange={event => setName(event.target.value)}
        onKeyPress={event =>
          event.key === 'Enter' ? createRoomCallback() : null
        }
        className={styles.name_input}
      />
      <Button
        onClick={createRoomCallback}
        disabled={isLoading || name.length === 0}
      >
        {isLoading ? 'Loading...' : 'Create Room'}
      </Button>
    </div>
  );
};

export default CreateRoom;
