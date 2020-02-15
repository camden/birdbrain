import React, { ReactElement, ReactNode } from 'react';
import { ResistanceMissionStatus } from '@server/store/games/the-resistance/types';
import styles from './MissionInfo.module.css';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/pro-solid-svg-icons';
import {
  faCircle,
  faTimesCircle,
  faCheckCircle,
} from '@fortawesome/pro-regular-svg-icons';

export interface ResistanceToolbarProps {
  number: number;
  requiredPlayers: number;
  status: ResistanceMissionStatus;
  isCurrentMission: boolean;
}

const ICON_SIZE = '2x';

const STATUS_ICONS: { [status in ResistanceMissionStatus]: ReactNode } = {
  [ResistanceMissionStatus.SUCCEEDED]: (
    <FontAwesomeIcon icon={faCheckCircle} size={ICON_SIZE} />
  ),
  [ResistanceMissionStatus.FAILED]: (
    <FontAwesomeIcon icon={faTimesCircle} size={ICON_SIZE} />
  ),
  [ResistanceMissionStatus.IN_PROGRESS]: (
    <FontAwesomeIcon icon={faCircle} size={ICON_SIZE} />
  ),
  [ResistanceMissionStatus.NOT_STARTED]: (
    <FontAwesomeIcon icon={faCircle} size={ICON_SIZE} />
  ),
};

const TheResistanceMissionInfo: React.FC<ResistanceToolbarProps> = ({
  requiredPlayers,
  status,
  isCurrentMission,
}) => {
  const statusIcon = STATUS_ICONS[status];

  return (
    <div
      className={cx(styles.mission_info, {
        [styles.current_mission]: isCurrentMission,
      })}
    >
      <div className={styles.player_count}>
        {requiredPlayers}
        <FontAwesomeIcon icon={faUser} size="xs" />
      </div>
      <div>{statusIcon}</div>
    </div>
  );
};

export default TheResistanceMissionInfo;
