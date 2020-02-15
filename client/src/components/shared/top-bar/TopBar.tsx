import React, { ComponentProps } from 'react';
import styles from './TopBar.module.css';
import { Room } from '@server/store/general/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/pro-solid-svg-icons';

export interface TopBarProps {
  room: Room;
}

const TopBar: React.FC<TopBarProps> = ({ room }) => {
  return (
    <div>
      <div className={styles.top_bar}>
        <div>
          <FontAwesomeIcon icon={faKey} />
          <span className={styles.room_code}>{room.id}</span>
        </div>
      </div>
      <div className={styles.spacing}></div>
    </div>
  );
};

export default TopBar;
