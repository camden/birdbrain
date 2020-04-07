import React from 'react';
import styles from './EmptyCard.module.css';
import cx from 'classnames';

export interface CardProps {
  dashedBorder?: boolean;
}

const MinidomEmptyCard: React.FC<CardProps> = props => {
  return (
    <div
      className={cx(styles.wrapper, {
        [styles.dashed]: props.dashedBorder,
      })}
    >
      {props.children}
    </div>
  );
};

export default MinidomEmptyCard;
