import React from 'react';
import { Room } from '@server/store/general/types';
import TopBar from 'components/shared/top-bar/TopBar';
import styles from './Room.module.css';

export interface RoomWrapperProps {
  room: Room;
}

const RoomWrapper: React.FC<RoomWrapperProps> = props => {
  return (
    <div className={styles.room}>
      <TopBar room={props.room} />
      {props.children}
    </div>
  );
};

export default RoomWrapper;
