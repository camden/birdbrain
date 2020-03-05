import React from 'react';
import { User } from '@server/store/general/types';
import UserAvatar from 'components/shared/user/UserAvatar';
import styles from './ChatMessage.module.scss';
import cx from 'classnames';

export interface ChatMessageProps {
  text: string;
  author: User;
  className?: string;
  fromCurrentUser?: boolean;
  hideAvatar?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = props => {
  return (
    <div
      className={cx(styles.message, props.className, {
        [styles.from_current_user]: props.fromCurrentUser,
        [styles.hide_avatar]: props.hideAvatar,
      })}
    >
      <div className={styles.avatar}>
        <UserAvatar user={props.author} small />
      </div>
      <div className={styles.message_text}>{props.text}</div>
    </div>
  );
};

export default ChatMessage;
