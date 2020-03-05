import React, { useState, useCallback, useEffect, useRef } from 'react';

import styles from './ChatMain.module.css';
import { ChatGameState } from '@server/store/games/chat/types';
import TextInput from 'components/shared/form/TextInput';
import Button from 'components/shared/button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/pro-solid-svg-icons';
import { sendChatMessage } from 'messages/chat-messages';
import { useDispatch } from 'react-redux';
import useSelector from 'store/use-selector';
import { getCurrentUser, getUsersInRoom } from 'store/selectors';
import ChatMessage from './ChatMessage';

export interface SkullProps {
  game: ChatGameState;
}

const ChatMain: React.FC<SkullProps> = ({ game }) => {
  const [messageText, setMessageText] = useState('');
  const currentUser = useSelector(getCurrentUser());
  const usersInRoom = useSelector(getUsersInRoom());
  const dispatch = useDispatch();
  const messagesListEl = useRef<HTMLDivElement>(null);

  const sendMessage = useCallback(() => {
    if (!currentUser) {
      return;
    }

    dispatch(sendChatMessage(messageText, currentUser.id));
    setMessageText('');
  }, [messageText, dispatch, currentUser]);

  useEffect(() => {
    if (!messagesListEl.current) {
      return;
    }

    const el = messagesListEl.current;
    const tolerance = 200;
    const isScrolledToBottom =
      Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) <= tolerance;

    if (isScrolledToBottom) {
      el.scrollTo(0, el.scrollHeight);
    }
  }, [game.messages]);

  const defaultUser = {
    name: '',
    id: '',
  };

  return (
    <div className={styles.chat}>
      <h1>Birdbrain Chat</h1>
      <section className={styles.messages_list} ref={messagesListEl}>
        {game.messages.map(msg => (
          <ChatMessage
            className={styles.message}
            key={msg.id}
            text={msg.text}
            rightAligned={msg.author === currentUser?.id}
            author={
              usersInRoom.find(user => msg.author === user.id) || defaultUser
            }
          />
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