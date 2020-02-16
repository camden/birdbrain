import React from 'react';
import styles from './RoomQRCode.module.css';
import QRCode from 'qrcode.react';
import Button from '../button/Button';

export interface TopBarProps {
  roomCode: string;
  onDoneClick: () => void;
}

const RoomQRCode: React.FC<TopBarProps> = ({ roomCode, onDoneClick }) => {
  const url = `http://birdbrain.games/?room=${roomCode}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.url}>birdbrain.games</div>
        <QRCode value={url} className={styles.qr_code} size={200} />
        <div className={styles.room_code}>{roomCode}</div>
        <Button className={styles.button} onClick={onDoneClick}>
          Done
        </Button>
      </div>
    </div>
  );
};

export default RoomQRCode;
