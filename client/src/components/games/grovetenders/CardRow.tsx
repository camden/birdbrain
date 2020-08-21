import React from 'react';
import { GroveCardType } from '@server/store/games/grovetenders/types';
import styles from './CardRow.module.css';
import GroveCard from './Card';
import GroveEmptyCard from './EmptyCard';

export interface CardRowProps {
  cards: GroveCardType[];
  onClick?: (card: GroveCardType, index: number) => void;
  hidden?: boolean;
}

const GroveCardRow: React.FC<CardRowProps> = ({ cards, hidden, onClick }) => {
  if (hidden) {
    return (
      <GroveEmptyCard dashedBorder={cards.length === 0}>
        <div className={styles.deckSize}>{cards.length}</div>
        cards
      </GroveEmptyCard>
    );
  }

  return (
    <div className={styles.wrapper}>
      {cards.map((card, index) => (
        <GroveCard
          card={card}
          onClick={() => onClick && onClick(card, index)}
        />
      ))}
    </div>
  );
};

export default GroveCardRow;
