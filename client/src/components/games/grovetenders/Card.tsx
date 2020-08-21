import React from 'react';
import {
  GroveCardType,
  GroveCardTarget,
  GroveCardDirection,
  GroveCardEffectTitles,
} from '@server/store/games/grovetenders/types';
import styles from './Card.module.css';
import GroveEmptyCard from './EmptyCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  IconDefinition,
  faArrowUp,
  faArrowDown,
  faArrowLeft,
} from '@fortawesome/pro-solid-svg-icons';

export interface CardProps {
  card: GroveCardType;
  onClick?: () => void;
}

export interface CardTargetProps {
  target: GroveCardTarget;
}

const CardTarget: React.FC<CardTargetProps> = ({ target }) => {
  let icon: IconDefinition | undefined;

  switch (target) {
    case GroveCardDirection.RIGHT:
      icon = faArrowRight;
      break;
    case GroveCardDirection.LEFT:
      icon = faArrowLeft;
      break;
    case GroveCardDirection.UP:
      icon = faArrowUp;
      break;
    case GroveCardDirection.DOWN:
      icon = faArrowDown;
      break;
    default:
      break;
  }

  return (
    <div className={styles.target}>
      {!!icon ? <FontAwesomeIcon icon={icon} size="2x" /> : target}
    </div>
  );
};

const GroveCard: React.FC<CardProps> = ({ card, onClick }) => {
  const effectTitle = GroveCardEffectTitles[card.effect];

  return (
    <GroveEmptyCard onClick={onClick}>
      <div className={styles.effect}>{effectTitle || card.effect}</div>
      <div className={styles.body}>
        <div className={styles.value}>{card.value}</div>
        {card.target && <CardTarget target={card.target} />}
      </div>
    </GroveEmptyCard>
  );
};

export default GroveCard;
