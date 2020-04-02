import React from 'react';

import styles from './TeamBar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers } from '@fortawesome/pro-solid-svg-icons';
import { FishbowlTeam } from '@server/store/games/fishbowl/types';
import {
  TEAM_A_DISPLAY_NAME,
  TEAM_B_DISPLAY_NAME,
} from '@server/store/games/fishbowl';
import cx from 'classnames';

export interface TeamBarProps {
  team: FishbowlTeam;
  playerName: string;
}

const TeamBar: React.FC<TeamBarProps> = props => {
  return (
    <>
      <div
        className={cx(styles.wrapper, {
          [styles.teamA]: props.team === FishbowlTeam.TEAM_A,
          [styles.teamB]: props.team === FishbowlTeam.TEAM_B,
        })}
      >
        <div className={styles.inner}>
          <div className={styles.playerName}>
            <FontAwesomeIcon icon={faUser} className={styles.icon} />
            {props.playerName}
          </div>
          <div className={styles.teamName}>
            <FontAwesomeIcon icon={faUsers} className={styles.icon} />
            {props.team === FishbowlTeam.TEAM_A
              ? TEAM_A_DISPLAY_NAME
              : TEAM_B_DISPLAY_NAME}
          </div>
        </div>
      </div>
      <div className={styles.spacing}></div>
    </>
  );
};

export default TeamBar;
