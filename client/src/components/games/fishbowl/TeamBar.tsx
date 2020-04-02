import React from 'react';

import styles from './TeamBar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers } from '@fortawesome/pro-solid-svg-icons';

export interface TeamBarProps {
  teamName: string;
  playerName: string;
}

const TeamBar: React.FC<TeamBarProps> = props => {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <div className={styles.playerName}>
            <FontAwesomeIcon icon={faUser} className={styles.icon} />
            {props.playerName}
          </div>
          <div className={styles.teamName}>
            <FontAwesomeIcon icon={faUsers} className={styles.icon} />
            {props.teamName}
          </div>
        </div>
      </div>
      <div className={styles.spacing}></div>
    </>
  );
};

export default TeamBar;
