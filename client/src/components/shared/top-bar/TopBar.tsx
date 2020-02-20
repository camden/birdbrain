import React, { useState } from 'react';
import styles from './TopBar.module.css';
import { Room } from '@server/store/general/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/pro-solid-svg-icons';
import RoomQRCode from './RoomQRCode';

export interface TopBarProps {
  room: Room;
}

const TopBar: React.FC<TopBarProps> = ({ room }) => {
  const [showQrCode, setShowQrCode] = useState(false);

  if (showQrCode) {
    return (
      <RoomQRCode roomCode={room.id} onDoneClick={() => setShowQrCode(false)} />
    );
  }

  return (
    <div>
      <div className={styles.top_bar}>
        <div onClick={() => setShowQrCode(true)}>
          <FontAwesomeIcon icon={faQrcode} />
          <span className={styles.room_code}>{room.id}</span>
        </div>
      </div>
      <div className={styles.spacing}></div>
    </div>
  );
};

export default TopBar;
