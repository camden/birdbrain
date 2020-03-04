import React from 'react';
import { Room } from '@server/store/general/types';
import TopBar from 'components/shared/top-bar/TopBar';
import styles from './Room.module.css';
import cx from 'classnames';

export interface RoomWrapperProps {
  room: Room;
  className?: string;
}

const RoomWrapper: React.FC<RoomWrapperProps> = props => {
  return (
    <div className={cx(styles.room, props.className)}>
      <TopBar room={props.room} />
      {props.children}
    </div>
  );
};

export default RoomWrapper;
