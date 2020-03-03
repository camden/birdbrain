import React, { useState } from 'react';
import styles from './TopBar.module.css';
import { Room } from '@server/store/general/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/pro-solid-svg-icons';
import RoomQRCode from './RoomQRCode';
import { useSelector } from 'react-redux';
import { getRoomLeader } from 'store/selectors';

export interface TopBarProps {
  room: Room;
}

const TopBar: React.FC<TopBarProps> = ({ room }) => {
  const [showQrCode, setShowQrCode] = useState(false);
  const roomLeader = useSelector(getRoomLeader());

  if (showQrCode) {
    return (
      <RoomQRCode roomCode={room.id} onDoneClick={() => setShowQrCode(false)} />
    );
  }

  const roomName = roomLeader ? `${roomLeader?.name}'s Room` : 'New Room';

  return (
    <div>
      <div className={styles.top_bar}>
        <div className={styles.room_name}>{roomName}</div>
        <div
          className={styles.clickable_code}
          onClick={() => setShowQrCode(true)}
        >
          <FontAwesomeIcon icon={faQrcode} />
          <div className={styles.room_code}>{room.id}</div>
        </div>
      </div>
      <div className={styles.spacing}></div>
    </div>
  );
};

export default TopBar;
