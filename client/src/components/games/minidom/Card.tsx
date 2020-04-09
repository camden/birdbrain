import React from 'react';
import {
  MinidomCardType,
  MinidomCardTarget,
  MinidomCardDirection,
  MinidomCardEffectTitles,
} from '@server/store/games/minidom/types';
import styles from './Card.module.css';
import MinidomEmptyCard from './EmptyCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  IconDefinition,
  faArrowUp,
  faArrowDown,
  faArrowLeft,
} from '@fortawesome/pro-solid-svg-icons';

export interface CardProps {
  card: MinidomCardType;
  onClick?: () => void;
}

export interface CardTargetProps {
  target: MinidomCardTarget;
}

const CardTarget: React.FC<CardTargetProps> = ({ target }) => {
  let icon: IconDefinition | undefined;

  switch (target) {
    case MinidomCardDirection.RIGHT:
      icon = faArrowRight;
      break;
    case MinidomCardDirection.LEFT:
      icon = faArrowLeft;
      break;
    case MinidomCardDirection.UP:
      icon = faArrowUp;
      break;
    case MinidomCardDirection.DOWN:
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

const MinidomCard: React.FC<CardProps> = ({ card, onClick }) => {
  const effectTitle = MinidomCardEffectTitles[card.effect];

  return (
    <MinidomEmptyCard onClick={onClick}>
      <div className={styles.effect}>{effectTitle || card.effect}</div>
      <div className={styles.body}>
        <div className={styles.value}>{card.value}</div>
        {card.target && <CardTarget target={card.target} />}
      </div>
    </MinidomEmptyCard>
  );
};

export default MinidomCard;
