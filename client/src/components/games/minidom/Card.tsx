import React from 'react';
import { MinidomCardType } from '@server/store/games/minidom/types';
import styles from './Card.module.css';
import MinidomEmptyCard from './EmptyCard';

export interface CardProps {
  card: MinidomCardType;
}

const MinidomCard: React.FC<CardProps> = ({ card }) => {
  return (
    <MinidomEmptyCard>
      <div className={styles.effect}>{card.effect}</div>
      <div className={styles.value}>{card.value}</div>
    </MinidomEmptyCard>
  );
};

export default MinidomCard;
