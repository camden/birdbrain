import React from 'react';
import { MinidomCardType } from '@server/store/games/minidom/types';
import styles from './Card.module.css';
import MinidomEmptyCard from './EmptyCard';

export interface CardProps {
  card: MinidomCardType;
  onClick?: () => void;
}

const MinidomCard: React.FC<CardProps> = ({ card, onClick }) => {
  return (
    <MinidomEmptyCard onClick={onClick}>
      <div className={styles.effect}>{card.effect}</div>
      <div className={styles.value}>{card.value}</div>
    </MinidomEmptyCard>
  );
};

export default MinidomCard;
