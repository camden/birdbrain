import React from 'react';
import styles from './EmptyCard.module.css';

export interface CardProps {}

const MinidomEmptyCard: React.FC<CardProps> = props => {
  return <div className={styles.wrapper}>{props.children}</div>;
};

export default MinidomEmptyCard;
