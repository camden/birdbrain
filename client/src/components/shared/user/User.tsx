import React, { ComponentProps, useState } from 'react';
import styles from './User.module.css';
import { User as UserType } from '@server/store/general/types';
import UserAvatar from './UserAvatar';
import {
  faStar,
  faCheck,
  faCheckCircle,
  faCircle,
} from '@fortawesome/pro-solid-svg-icons';
import cx from 'classnames';

export interface UserProps {
  user: UserType;
  isLeader?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
}

const User: React.FC<UserProps> = ({
  user,
  isLeader,
  isSelected,
  onSelect,
}) => {
  let icon, iconColor;
  if (isSelected) {
    icon = faStar;
    iconColor = '#00ce00';
  } else if (isLeader) {
    icon = faStar;
  }

  // TODO make this click accessible!!!!!
  // use input[type=checkbox]
  return (
    <div
      className={cx(styles.user, {
        [styles.selectable]: !!onSelect,
        [styles.selected]: isSelected,
      })}
      onClick={onSelect}
    >
      <UserAvatar
        user={user}
        icon={icon}
        iconColor={iconColor}
        isBordered={false}
        borderColor={iconColor}
        onClick={onSelect}
      />
      <div className={styles.name}>{user.name}</div>
    </div>
  );
};

export default User;
