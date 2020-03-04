import React from 'react';

import styles from './ChatMain.module.css';
import { ChatGameState } from '@server/store/games/chat/types';
import TextInput from 'components/shared/form/TextInput';
import Button from 'components/shared/button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/pro-solid-svg-icons';

export interface SkullProps {
  game: ChatGameState;
}

const ChatMain: React.FC<SkullProps> = ({ game }) => {
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
        <TextInput id="chat-compose-input" className={styles.input} />
        <Button secondary>Send</Button>
      </section>
    </div>
  );
};

export default ChatMain;
