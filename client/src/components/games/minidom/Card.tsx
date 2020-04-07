import React from 'react';
import { MinidomCard as MinidomCardType } from '@server/store/games/minidom/types';
import styles from './Card.module.css';

export interface CardProps {
  card: MinidomCardType;
}

const MinidomCard: React.FC<CardProps> = ({ card }) => {
  return (
    <div className={styles.wrapper}>
      {card.effect} -> {card.value}
    </div>
  );
};

export default MinidomCard;
