import React from 'react';
import { ResistanceMissionStatus } from '@server/store/games/the-resistance/types';
import styles from './MissionInfo.module.css';
import cx from 'classnames';

export interface ResistanceToolbarProps {
  number: number;
  requiredPlayers: number;
  status: ResistanceMissionStatus;
  isCurrentMission: boolean;
}

const STATUS_ICONS: { [status in ResistanceMissionStatus]: string } = {
  [ResistanceMissionStatus.SUCCEEDED]: '✅',
  [ResistanceMissionStatus.FAILED]: '❌',
  [ResistanceMissionStatus.IN_PROGRESS]: '',
  [ResistanceMissionStatus.NOT_STARTED]: '',
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
      <div>{requiredPlayers}</div>
      <div>{statusIcon}</div>
    </div>
  );
};

export default TheResistanceMissionInfo;
