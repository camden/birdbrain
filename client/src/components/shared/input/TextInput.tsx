import React, { ComponentProps } from 'react';
import styles from './TextInput.module.css';
import cx from 'classnames';

export interface CustomTextInputProps {}

export type TextInputProps = ComponentProps<'input'> & CustomTextInputProps;

const TextInput: React.FC<TextInputProps> = props => {
  const classNames = cx(props.className, styles.input);
  return <input type="text" {...props} className={classNames} />;
};

/**
 *          id="room-code"
            name="called-search-to-disable-autocomplete1"
            placeholder="Room Code"
            value={roomCode}
            onKeyPress={event =>
              event.key === 'Enter' ? joinRoomCallback() : null
            }
            onChange={event => setRoomCode(event.target.value.toUpperCase())}
            className={styles.join_room_input}
            autoComplete="off"
 */

export default TextInput;
