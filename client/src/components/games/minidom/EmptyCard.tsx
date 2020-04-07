import React from 'react';
import styles from './EmptyCard.module.css';
import cx from 'classnames';

export interface CardProps {
  onClick?: () => void;
  dashedBorder?: boolean;
}

const MinidomEmptyCard: React.FC<CardProps> = props => {
  return (
    <div
      onClick={props.onClick}
      className={cx(styles.wrapper, {
        [styles.clickable]: !!props.onClick,
        [styles.dashed]: props.dashedBorder,
      })}
    >
      {props.children}
    </div>
  );
};

export default MinidomEmptyCard;
