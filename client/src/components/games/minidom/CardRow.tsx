import React from 'react';
import { MinidomCardType } from '@server/store/games/minidom/types';
import styles from './CardRow.module.css';
import MinidomCard from './Card';
import MinidomEmptyCard from './EmptyCard';

export interface CardRowProps {
  cards: MinidomCardType[];
  hidden?: boolean;
}

const MinidomCardRow: React.FC<CardRowProps> = ({ cards, hidden }) => {
  if (hidden) {
    return (
      <MinidomEmptyCard>
        <div className={styles.deckSize}>{cards.length}</div>
        cards
      </MinidomEmptyCard>
    );
  }

  return (
    <div className={styles.wrapper}>
      {cards.map(card => (
        <MinidomCard card={card} />
      ))}
    </div>
  );
};

export default MinidomCardRow;
