import React from 'react';
import styles from './User.module.css';
import { User as UserType } from '@server/store/general/types';
import UserAvatar from './UserAvatar';
import { faStar, IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import cx from 'classnames';

// TODO these props could be better
export interface UserProps {
  user: UserType;
  isLeader?: boolean;
  isSelected?: boolean;
  icon?: IconDefinition;
  iconColor?: string;
  onSelect?: () => void;
  isSelectionDisabled?: boolean;
}

const User: React.FC<UserProps> = ({
  user,
  isLeader,
  isSelected,
  onSelect,
  icon: iconFromProps,
  iconColor: iconColorFromProps,
  isSelectionDisabled,
}) => {
  let icon = iconFromProps;
  let iconColor = iconColorFromProps;

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
        [styles.selectable]: !isSelectionDisabled && !!onSelect,
        [styles.selected]: isSelected,
        [styles.selection_disabled]: isSelectionDisabled,
      })}
      onClick={isSelectionDisabled ? undefined : onSelect}
    >
      <UserAvatar
        user={user}
        icon={icon}
        iconColor={iconColor}
        isBordered={false}
        borderColor={iconColor}
        onClick={isSelectionDisabled ? undefined : onSelect}
      />
      <div className={styles.name}>{user.name}</div>
    </div>
  );
};

export default User;
