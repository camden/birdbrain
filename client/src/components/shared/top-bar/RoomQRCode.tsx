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
      <section className={styles.inner}>
        <h2 className={styles.url}>birdbrain.games</h2>
        <div className={styles.qr_code_wrapper}>
          <QRCode value={url} className={styles.qr_code} size={200} />
        </div>
        <h2 className={styles.room_code}>{roomCode}</h2>
      </section>
      <Button
        fullWidth
        secondary
        className={styles.button}
        onClick={onDoneClick}
      >
        Done
      </Button>
    </div>
  );
};

export default RoomQRCode;
