import React from 'react';
import { ResistanceMissionStatus } from '@server/store/games/the-resistance/types';
import styles from './MissionInfo.module.css';

export interface ResistanceToolbarProps {
  number: number;
  requiredPlayers: number;
  status: ResistanceMissionStatus;
}

const STATUS_ICONS: { [status in ResistanceMissionStatus]: string } = {
  [ResistanceMissionStatus.SUCCEEDED]: 's',
  [ResistanceMissionStatus.FAILED]: 'f',
  [ResistanceMissionStatus.IN_PROGRESS]: 'i',
  [ResistanceMissionStatus.NOT_STARTED]: 'n',
};

const TheResistanceMissionInfo: React.FC<ResistanceToolbarProps> = ({
  number,
  requiredPlayers,
  status,
}) => {
  const statusIcon = STATUS_ICONS[status];

  return (
    <div className={styles.mission_info}>
      <div>{requiredPlayers}</div>
      <div>{statusIcon}</div>
    </div>
  );
};

export default TheResistanceMissionInfo;
