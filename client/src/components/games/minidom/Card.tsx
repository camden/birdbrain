import React from 'react';
import { MinidomCardType } from '@server/store/games/minidom/types';
import styles from './Card.module.css';

export interface CardProps {
  card: MinidomCardType;
}

const MinidomCard: React.FC<CardProps> = ({ card }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.effect}>{card.effect}</div>
      <div className={styles.value}>{card.value}</div>
    </div>
  );
};

export default MinidomCard;
