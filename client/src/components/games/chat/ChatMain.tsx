import React, { useState, useCallback } from 'react';

import styles from './ChatMain.module.css';
import { ChatGameState } from '@server/store/games/chat/types';
import TextInput from 'components/shared/form/TextInput';
import Button from 'components/shared/button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/pro-solid-svg-icons';
import { sendChatMessage } from 'messages/chat-messages';
import { useDispatch } from 'react-redux';
import useSelector from 'store/use-selector';
import { getCurrentUser } from 'store/selectors';

export interface SkullProps {
  game: ChatGameState;
}

const ChatMain: React.FC<SkullProps> = ({ game }) => {
  const [messageText, setMessageText] = useState('');
  const currentUser = useSelector(getCurrentUser());
  const dispatch = useDispatch();

  const sendMessage = useCallback(() => {
    if (!currentUser) {
      return;
    }

    dispatch(sendChatMessage(messageText, currentUser.id));
    setMessageText('');
  }, [messageText, dispatch, currentUser]);

  return (
    <div className={styles.chat}>
      <h1>Birdbrain Chat</h1>
      <section className={styles.messages_list}>
        {game.messages.map(msg => (
          <div key={msg.id}>{msg.text}</div>
        ))}
      </section>
      <section className={styles.compose_area}>
        <label htmlFor="chat-compose-input" className={styles.input_label}>
          <FontAwesomeIcon
            icon={faComment}
            className={styles.input_label_icon}
          />
          Message
        </label>
        <TextInput
          id="chat-compose-input"
          className={styles.input}
          value={messageText}
          onKeyPress={event => event.key === 'Enter' && sendMessage()}
          onChange={event => setMessageText(event.target.value)}
        />
        <Button secondary onClick={sendMessage}>
          Send
        </Button>
      </section>
    </div>
  );
};

export default ChatMain;
