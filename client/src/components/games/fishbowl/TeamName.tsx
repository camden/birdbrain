import React from 'react';
import { FishbowlTeam } from '@server/store/games/fishbowl/types';
import {
  TEAM_A_DISPLAY_NAME,
  TEAM_B_DISPLAY_NAME,
} from '@server/store/games/fishbowl';
import cx from 'classnames';
import styles from './TeamName.module.css';

export interface TeamNameProps {
  team: FishbowlTeam;
}

const TeamName: React.FC<TeamNameProps> = props => {
  return (
    <span
      className={cx(styles.team, {
        [styles.teamA]: props.team === FishbowlTeam.TEAM_A,
        [styles.teamB]: props.team === FishbowlTeam.TEAM_B,
      })}
    >
      {props.team === FishbowlTeam.TEAM_A
        ? TEAM_A_DISPLAY_NAME
        : TEAM_B_DISPLAY_NAME}
    </span>
  );
};

export default TeamName;
