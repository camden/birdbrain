import React, { ComponentProps } from 'react';
import styles from './User.module.css';
import { User as UserType } from '@server/store/general/types';
import UserAvatar from './UserAvatar';
import { faStar } from '@fortawesome/pro-solid-svg-icons';

export interface UserProps {
  user: UserType;
  isLeader?: boolean;
}

const User: React.FC<UserProps> = ({ user, isLeader }) => {
  let icon;

  if (isLeader) {
    icon = faStar;
  }

  return (
    <div className={styles.user}>
      <UserAvatar user={user} icon={icon} />
      <div className={styles.name}>{user.name}</div>
    </div>
  );
};

export default User;
