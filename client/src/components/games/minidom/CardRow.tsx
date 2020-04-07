import React from 'react';
import { MinidomCardType } from '@server/store/games/minidom/types';
import styles from './CardRow.module.css';
import MinidomCard from './Card';

export interface CardRowProps {
  cards: MinidomCardType[];
}

const MinidomCardRow: React.FC<CardRowProps> = ({ cards }) => {
  return (
    <div className={styles.wrapper}>
      {cards.map(card => (
        <MinidomCard card={card} />
      ))}
    </div>
  );
};

export default MinidomCardRow;
