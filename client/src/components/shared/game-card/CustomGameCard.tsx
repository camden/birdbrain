import React from 'react';

import styles from './GameCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faClock } from '@fortawesome/pro-solid-svg-icons';
import cx from 'classnames';

export interface CustomGameCardProps {
  title: string;
  description: string;
  playerCount: string;
  time: string;
  onClick?: () => void;
}

const CustomGameCard: React.FC<CustomGameCardProps> = props => {
  return (
    <div
      className={cx(styles.card, {
        [styles.selectable]: !!props.onClick,
      })}
      onClick={props.onClick}
    >
      <h2 className={styles.title}>{props.title}</h2>
      <p className={styles.description}>{props.description}</p>
      <div className={styles.footer}>
        <small className={styles.info_group}>
          <FontAwesomeIcon
            icon={faUserFriends}
            className={styles.info_group_icon}
          />
          <span className={styles.info_group_text}>{props.playerCount}</span>
        </small>
        <small className={styles.info_group}>
          <FontAwesomeIcon icon={faClock} className={styles.info_group_icon} />
          <span className={styles.info_group_text}>{props.time}</span>
        </small>
      </div>
    </div>
  );
};

export default CustomGameCard;
