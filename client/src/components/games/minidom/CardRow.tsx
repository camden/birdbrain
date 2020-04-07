import React from 'react';
import { MinidomCardType } from '@server/store/games/minidom/types';
import styles from './CardRow.module.css';
import MinidomCard from './Card';
import MinidomEmptyCard from './EmptyCard';

export interface CardRowProps {
  cards: MinidomCardType[];
  onClick?: (card: MinidomCardType, index: number) => void;
  hidden?: boolean;
}

const MinidomCardRow: React.FC<CardRowProps> = ({ cards, hidden, onClick }) => {
  if (hidden) {
    return (
      <MinidomEmptyCard dashedBorder={cards.length === 0}>
        <div className={styles.deckSize}>{cards.length}</div>
        cards
      </MinidomEmptyCard>
    );
  }

  return (
    <div className={styles.wrapper}>
      {cards.map((card, index) => (
        <MinidomCard
          card={card}
          onClick={() => onClick && onClick(card, index)}
        />
      ))}
    </div>
  );
};

export default MinidomCardRow;
